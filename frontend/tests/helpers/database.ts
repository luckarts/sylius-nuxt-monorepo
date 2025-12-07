import { Client } from 'pg'

/**
 * Helper pour interroger la base de données Sylius (PostgreSQL)
 */
export class DatabaseHelper {
  private client: Client

  constructor() {
    // Configuration de connexion PostgreSQL
    // En Docker E2E, le service s'appelle 'postgres'
    // En local, c'est localhost:5433
    const isDocker = process.env.CI === 'true'

    this.client = new Client({
      host: isDocker ? 'postgres' : 'localhost',
      port: isDocker ? 5432 : 5433,
      database: process.env.POSTGRES_DB || 'sylius_e2e',
      user: process.env.POSTGRES_USER || 'sylius',
      password: process.env.POSTGRES_PASSWORD || 'sylius_password',
    })
  }

  /**
   * Connecte à la base de données
   */
  async connect(): Promise<void> {
    await this.client.connect()
  }

  /**
   * Déconnecte de la base de données
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.end()
    } catch (error) {
      // Silently fail on disconnect
    }
  }

  /**
   * Vérifie si un utilisateur existe par email
   */
  async userExists(email: string): Promise<boolean> {
    const result = await this.client.query('SELECT id FROM sylius_shop_user WHERE username = $1', [
      email,
    ])
    return result.rows.length > 0
  }

  /**
   * Vérifie si l'email d'un utilisateur a été vérifié
   * @param email - L'email de l'utilisateur
   * @returns true si l'email est vérifié (emailVerificationToken est null)
   */
  async isEmailVerified(email: string): Promise<boolean> {
    const result = await this.client.query(
      `SELECT email_verification_token
      FROM sylius_shop_user
      WHERE username = $1`,
      [email]
    )

    if (result.rows.length === 0) {
      return false
    }

    // Un email est vérifié si le token est null
    return result.rows[0].email_verification_token === null
  }

  /**
   * Récupère les informations d'un utilisateur
   */
  async getUserInfo(email: string): Promise<{
    id: number
    username: string
    email_verification_token: string | null
    enabled: boolean
    verified_at: string | null
    created_at: string
    updated_at: string
  } | null> {
    const result = await this.client.query(
      `SELECT
        id,
        username,
        email_verification_token,
        enabled,
        verified_at,
        created_at,
        updated_at
      FROM sylius_shop_user
      WHERE username = $1`,
      [email]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  }

  /**
   * Récupère le token de vérification d'un utilisateur
   */
  async getVerificationToken(email: string): Promise<string | null> {
    const result = await this.client.query(
      'SELECT email_verification_token FROM sylius_shop_user WHERE username = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0].email_verification_token
  }

  /**
   * Compte le nombre d'utilisateurs dans la base
   */
  async countUsers(): Promise<number> {
    const result = await this.client.query('SELECT COUNT(*) as count FROM sylius_shop_user')
    return Number.parseInt(result.rows[0].count, 10)
  }

  /**
   * Nettoie les utilisateurs de test (optionnel)
   */
  async cleanupTestUsers(emailPattern = '%@example.com'): Promise<number> {
    const result = await this.client.query(
      'DELETE FROM sylius_shop_user WHERE username LIKE $1 RETURNING id',
      [emailPattern]
    )
    return result.rowCount || 0
  }
}
