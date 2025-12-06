<?php

declare(strict_types=1);

namespace App\Command;

use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Sylius\Component\Core\Model\CustomerInterface;
use Sylius\Component\Core\Repository\CustomerRepositoryInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:delete-customer',
    description: 'Delete customers and all their related data (for development purposes)',
)]
final class DeleteCustomerCommand extends Command
{
    public function __construct(
        private readonly CustomerRepositoryInterface $customerRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly Connection $connection,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('identifier', InputArgument::OPTIONAL, 'Customer ID or email to delete')
            ->addOption('id', null, InputOption::VALUE_REQUIRED | InputOption::VALUE_IS_ARRAY, 'Customer ID(s) to delete')
            ->addOption('email', null, InputOption::VALUE_REQUIRED | InputOption::VALUE_IS_ARRAY, 'Customer email(s) to delete')
            ->addOption('pattern', 'p', InputOption::VALUE_REQUIRED, 'Delete customers matching email pattern (e.g., %test%)')
            ->addOption('all-unverified', null, InputOption::VALUE_NONE, 'Delete all unverified customers')
            ->addOption('force', 'f', InputOption::VALUE_NONE, 'Force deletion without confirmation')
            ->setHelp(<<<'HELP'
The <info>%command.name%</info> command deletes customers and all their related data:

Delete by email:
  <info>php %command.full_name% user@example.com</info>

Delete by ID:
  <info>php %command.full_name% 1451</info>

Delete multiple by IDs:
  <info>php %command.full_name% --id=1451 --id=1452 --id=1453</info>

Delete multiple by emails:
  <info>php %command.full_name% --email=user1@test.com --email=user2@test.com</info>

Delete by email pattern:
  <info>php %command.full_name% --pattern="%test%"</info>

Delete all unverified customers:
  <info>php %command.full_name% --all-unverified</info>

Force deletion without confirmation:
  <info>php %command.full_name% user@example.com --force</info>
HELP
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $identifier = $input->getArgument('identifier');
        $ids = $input->getOption('id');
        $emails = $input->getOption('email');
        $pattern = $input->getOption('pattern');
        $allUnverified = $input->getOption('all-unverified');
        $force = $input->getOption('force');

        $customerIds = [];

        // Collect customer IDs based on different options
        if (null !== $identifier) {
            $customerId = $this->resolveCustomerId($identifier, $io);
            if (null === $customerId) {
                return Command::FAILURE;
            }
            $customerIds[] = $customerId;
        }

        if (!empty($ids)) {
            foreach ($ids as $id) {
                if (is_numeric($id)) {
                    $customerIds[] = (int) $id;
                }
            }
        }

        if (!empty($emails)) {
            foreach ($emails as $email) {
                $customer = $this->customerRepository->findOneBy(['email' => $email]);
                if (null !== $customer) {
                    $customerIds[] = $customer->getId();
                } else {
                    $io->warning(sprintf('Customer with email "%s" not found', $email));
                }
            }
        }

        if (null !== $pattern) {
            $customers = $this->connection->fetchAllAssociative(
                'SELECT id, email FROM sylius_customer WHERE email LIKE :pattern',
                ['pattern' => $pattern]
            );
            foreach ($customers as $customer) {
                $customerIds[] = (int) $customer['id'];
            }
            if (!empty($customers)) {
                $io->note(sprintf('Found %d customer(s) matching pattern "%s"', count($customers), $pattern));
                $io->listing(array_column($customers, 'email'));
            }
        }

        if ($allUnverified) {
            $unverifiedIds = $this->connection->fetchFirstColumn(
                'SELECT customer_id FROM sylius_shop_user WHERE verified_at IS NULL'
            );
            $customerIds = array_merge($customerIds, array_map('intval', $unverifiedIds));
            $io->note(sprintf('Found %d unverified customer(s)', count($unverifiedIds)));
        }

        // Remove duplicates
        $customerIds = array_unique($customerIds);

        if (empty($customerIds)) {
            $io->warning('No customers found to delete');
            return Command::SUCCESS;
        }

        // Show what will be deleted
        $this->displayDeletionPreview($io, $customerIds);

        // Confirmation
        if (!$force) {
            $helper = $this->getHelper('question');
            $question = new ConfirmationQuestion(
                sprintf('Are you sure you want to delete %d customer(s) and all their data? (y/N) ', count($customerIds)),
                false
            );

            if (!$helper->ask($input, $output, $question)) {
                $io->info('Deletion cancelled');
                return Command::SUCCESS;
            }
        }

        // Perform deletion
        try {
            $deletedCount = $this->deleteCustomers($customerIds, $io);
            $io->success(sprintf('Successfully deleted %d customer(s) and all their related data!', $deletedCount));
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error(sprintf('Error during deletion: %s', $e->getMessage()));
            return Command::FAILURE;
        }
    }

    private function resolveCustomerId(string $identifier, SymfonyStyle $io): ?int
    {
        // Try as ID first
        if (is_numeric($identifier)) {
            $customer = $this->customerRepository->find((int) $identifier);
            if (null !== $customer) {
                return $customer->getId();
            }
        }

        // Try as email
        $customer = $this->customerRepository->findOneBy(['email' => $identifier]);
        if (null !== $customer) {
            return $customer->getId();
        }

        $io->error(sprintf('Customer with identifier "%s" not found', $identifier));
        return null;
    }

    private function displayDeletionPreview(SymfonyStyle $io, array $customerIds): void
    {
        $customers = $this->connection->fetchAllAssociative(
            sprintf('SELECT id, email, first_name, last_name FROM sylius_customer WHERE id IN (%s)', implode(',', $customerIds))
        );

        $io->section('Customers to be deleted:');
        $io->table(
            ['ID', 'Email', 'First Name', 'Last Name'],
            array_map(fn($c) => [$c['id'], $c['email'], $c['first_name'] ?? '', $c['last_name'] ?? ''], $customers)
        );

        // Count related data
        $stats = [
            'Shop Users' => $this->connection->fetchOne(
                sprintf('SELECT COUNT(*) FROM sylius_shop_user WHERE customer_id IN (%s)', implode(',', $customerIds))
            ),
            'Addresses' => $this->connection->fetchOne(
                sprintf('SELECT COUNT(*) FROM sylius_address WHERE customer_id IN (%s)', implode(',', $customerIds))
            ),
            'Orders' => $this->connection->fetchOne(
                sprintf('SELECT COUNT(*) FROM sylius_order WHERE customer_id IN (%s)', implode(',', $customerIds))
            ),
        ];

        $io->section('Related data to be deleted:');
        foreach ($stats as $label => $count) {
            $io->writeln(sprintf('  • %s: <info>%d</info>', $label, $count));
        }

        $io->newLine();
        $io->warning('This action cannot be undone!');
    }

    private function deleteCustomers(array $customerIds, SymfonyStyle $io): int
    {
        $idsString = implode(',', $customerIds);

        $io->progressStart(5);

        // 1. Delete order items
        $io->progressAdvance();
        $this->connection->executeStatement(
            sprintf(
                'DELETE FROM sylius_order_item WHERE order_id IN (SELECT id FROM sylius_order WHERE customer_id IN (%s))',
                $idsString
            )
        );

        // 2. Delete orders
        $io->progressAdvance();
        $this->connection->executeStatement(
            sprintf('DELETE FROM sylius_order WHERE customer_id IN (%s)', $idsString)
        );

        // 3. Delete shop users
        $io->progressAdvance();
        $this->connection->executeStatement(
            sprintf('DELETE FROM sylius_shop_user WHERE customer_id IN (%s)', $idsString)
        );

        // 4. Delete addresses
        $io->progressAdvance();
        $this->connection->executeStatement(
            sprintf('DELETE FROM sylius_address WHERE customer_id IN (%s)', $idsString)
        );

        // 5. Delete customers
        $io->progressAdvance();
        $this->connection->executeStatement(
            sprintf('DELETE FROM sylius_customer WHERE id IN (%s)', $idsString)
        );

        $io->progressFinish();

        return count($customerIds);
    }
}
