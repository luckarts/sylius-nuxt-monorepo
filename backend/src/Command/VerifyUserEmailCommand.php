<?php

declare(strict_types=1);

namespace App\Command;

use Doctrine\ORM\EntityManagerInterface;
use Sylius\Component\Core\Model\ShopUserInterface;
use Sylius\Component\User\Repository\UserRepositoryInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:verify-user-email',
    description: 'Verify a shop user email address (for development purposes)',
)]
final class VerifyUserEmailCommand extends Command
{
    public function __construct(
        private readonly UserRepositoryInterface $shopUserRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::OPTIONAL, 'User email address to verify')
            ->addOption('all', 'a', InputOption::VALUE_NONE, 'Verify all unverified users')
            ->addOption('latest', 'l', InputOption::VALUE_NONE, 'Verify the latest registered user')
            ->setHelp(<<<'HELP'
The <info>%command.name%</info> command verifies shop user email addresses:

  <info>php %command.full_name% user@example.com</info>

Verify all unverified users:
  <info>php %command.full_name% --all</info>

Verify the latest registered user:
  <info>php %command.full_name% --latest</info>
HELP
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email = $input->getArgument('email');
        $verifyAll = $input->getOption('all');
        $verifyLatest = $input->getOption('latest');

        if ($verifyAll) {
            return $this->verifyAllUsers($io);
        }

        if ($verifyLatest) {
            return $this->verifyLatestUser($io);
        }

        if (null === $email) {
            $io->error('Please provide an email address or use --all or --latest option');
            return Command::INVALID;
        }

        return $this->verifyUserByEmail($io, $email);
    }

    private function verifyUserByEmail(SymfonyStyle $io, string $email): int
    {
        /** @var ShopUserInterface|null $user */
        $user = $this->shopUserRepository->findOneByEmail($email);

        if (null === $user) {
            $io->error(sprintf('User with email "%s" not found', $email));
            return Command::FAILURE;
        }

        if (null !== $user->getVerifiedAt()) {
            $io->warning(sprintf('User "%s" is already verified (verified at: %s)', $email, $user->getVerifiedAt()->format('Y-m-d H:i:s')));
            return Command::SUCCESS;
        }

        $this->verifyUser($user);

        $io->success(sprintf('User "%s" has been verified successfully!', $email));
        $io->table(
            ['Email', 'Verified At', 'Enabled'],
            [[$user->getEmail(), $user->getVerifiedAt()->format('Y-m-d H:i:s'), $user->isEnabled() ? 'Yes' : 'No']]
        );

        return Command::SUCCESS;
    }

    private function verifyAllUsers(SymfonyStyle $io): int
    {
        $users = $this->entityManager->createQueryBuilder()
            ->select('u')
            ->from(ShopUserInterface::class, 'u')
            ->where('u.verifiedAt IS NULL')
            ->getQuery()
            ->getResult();

        if (empty($users)) {
            $io->warning('No unverified users found');
            return Command::SUCCESS;
        }

        $io->note(sprintf('Found %d unverified user(s)', count($users)));

        $verifiedCount = 0;
        foreach ($users as $user) {
            $this->verifyUser($user);
            $io->writeln(sprintf('  ✓ Verified: %s', $user->getEmail()));
            ++$verifiedCount;
        }

        $io->success(sprintf('Successfully verified %d user(s)!', $verifiedCount));

        return Command::SUCCESS;
    }

    private function verifyLatestUser(SymfonyStyle $io): int
    {
        /** @var ShopUserInterface|null $user */
        $user = $this->entityManager->createQueryBuilder()
            ->select('u')
            ->from(ShopUserInterface::class, 'u')
            ->where('u.verifiedAt IS NULL')
            ->orderBy('u.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        if (null === $user) {
            $io->warning('No unverified user found');
            return Command::SUCCESS;
        }

        $this->verifyUser($user);

        $io->success(sprintf('Latest user "%s" has been verified successfully!', $user->getEmail()));
        $io->table(
            ['Email', 'Verified At', 'Token Cleared'],
            [[$user->getEmail(), $user->getVerifiedAt()->format('Y-m-d H:i:s'), 'Yes']]
        );

        return Command::SUCCESS;
    }

    private function verifyUser(ShopUserInterface $user): void
    {
        $user->setVerifiedAt(new \DateTime());
        $user->setEmailVerificationToken(null);
        $user->enable();

        $this->entityManager->flush();
    }
}
