interface MailpitMessage {
  ID: string
  From: { Address: string; Name: string }
  To: Array<{ Address: string; Name: string }>
  Subject: string
  Created: string
  Text: string
  HTML: string
}

interface MailpitResponse {
  total: number
  messages: MailpitMessage[]
}

export class MailpitHelper {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.MAILPIT_URL || 'http://localhost:8025'
  }

  /**
   * Récupère tous les messages (métadonnées uniquement)
   */
  async getMessages(): Promise<MailpitMessage[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/messages`)
    const data: MailpitResponse = await response.json()
    return data.messages || []
  }

  /**
   * Récupère le contenu complet d'un message par son ID
   */
  async getMessageById(id: string): Promise<MailpitMessage | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/message/${id}`)
      if (!response.ok) {
        return null
      }
      const message: MailpitMessage = await response.json()

      return message
    } catch (error) {
      return null
    }
  }

  /**
   * Récupère le dernier message envoyé (avec contenu complet)
   */
  async getLatestMessage(): Promise<MailpitMessage | null> {
    const messages = await this.getMessages()
    if (messages.length === 0) return null

    // Récupérer le contenu complet du dernier message
    return this.getMessageById(messages[0].ID)
  }

  /**
   * Récupère un message par email destinataire (avec contenu complet)
   */
  async getMessageByRecipient(email: string): Promise<MailpitMessage | null> {
    const messages = await this.getMessages()
    const found = messages.find((msg) =>
      msg.To.some((to) => to.Address.toLowerCase() === email.toLowerCase())
    )

    if (!found) return null

    // Récupérer le contenu complet
    return this.getMessageById(found.ID)
  }

  /**
   * Récupère un message par sujet (avec contenu complet)
   */
  async getMessageBySubject(subject: string): Promise<MailpitMessage | null> {
    const messages = await this.getMessages()
    const found = messages.find((msg) => msg.Subject.includes(subject))

    if (!found) return null

    // Récupérer le contenu complet
    return this.getMessageById(found.ID)
  }

  /**
   * Extrait un lien d'un email (ex: lien de vérification)
   */
  extractLink(message: MailpitMessage, pattern: RegExp): string | null {
    const match = message.HTML.match(pattern) || message.Text.match(pattern)
    return match ? match[1] || match[0] : null
  }

  /**
   * Extrait un token depuis une URL dans l'email
   * @param message - Le message email
   * @param urlPattern - Pattern pour trouver l'URL (ex: "verify")
   * @returns Le token extrait ou null
   */
  extractToken(message: MailpitMessage, urlPattern: string): string | null {
    // Chercher l'URL contenant le pattern
    const urlRegex = new RegExp(
      `(https?:\\/\\/[^\\s"'<>]+(?:\\/[a-z]{2}_[A-Z]{2})?\\/${urlPattern}\\/[^\\s"'<>]+)`,
      'i'
    )
    const url = this.extractLink(message, urlRegex)

    if (!url) {
      return null
    }

    // Extraire le token (dernière partie de l'URL après le pattern)
    const tokenRegex = new RegExp(`\\/${urlPattern}\\/([^\\s"'<>]+)`)
    const tokenMatch = url.match(tokenRegex)

    if (!tokenMatch) {
      return null
    }

    return tokenMatch[1]
  }

  /**
   * Supprime tous les messages
   */
  async clearMessages(): Promise<void> {
    await fetch(`${this.baseUrl}/api/v1/messages`, {
      method: 'DELETE',
    })
  }

  /**
   * Attend qu'un email arrive (avec timeout) et retourne le contenu complet
   */
  async waitForMessage(
    predicate: (msg: MailpitMessage) => boolean,
    timeout = 10000
  ): Promise<MailpitMessage | null> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      const messages = await this.getMessages()
      const found = messages.find(predicate)

      if (found) {
        // Récupérer le contenu complet du message
        return this.getMessageById(found.ID)
      }

      // Attendre 500ms avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return null
  }
}
