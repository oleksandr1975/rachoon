import Format from '@repo/common/Format'
import Client from 'App/Models/Client'
import Document from 'App/Models/Document'
import User from 'App/Models/User'

export default class Numberervice {
  public static async document(user: User, type: string) {
    const count = await Document.query()
      .where({
        organizationId: user?.organizationId,
        type: type.toLowerCase(),
      })
      .withTrashed()
      .getCount()

    let documentNumber: any
    switch (type) {
      case 'invoice':
        documentNumber = user.organization.settings.invoices.number
        break
      case 'offer':
        documentNumber = user.organization.settings.offers.number
        break
      case 'reminder':
        documentNumber = user.organization.settings.reminders.number
        break
      default:
        throw new Error('Type must be invoice, offer or document')
    }

    return Format.number(documentNumber, Number(count))
  }

  public static async client(user: User) {
    const count = await Client.query()
      .where({
        organizationId: user?.organizationId,
      })
      .withTrashed()
      .getCount()

    return Format.number(user.organization.settings.clients.number, Number(count))
  }
}
