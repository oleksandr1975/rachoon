import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Document from 'App/Models/Document'

export default class DashboardController {
  public async index(ctx: HttpContextContract) {
    const pendingInvoices = await Document.query()
      .where({
        type: 'invoice',
        status: 'pending',
        organizationId: ctx.auth.user?.organization.id,
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .orderBy('created_at', 'desc')
      .limit(5)

    const pendingOffers = await Document.query()
      .where({
        type: 'offer',
        status: 'pending',
        organizationId: ctx.auth.user?.organization.id,
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .orderBy('created_at', 'desc')
      .limit(5)

    const pendingReminders = await Document.query()
      .where({
        type: 'reminder',
        status: 'pending',
        organizationId: ctx.auth.user?.organization.id,
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .orderBy('created_at', 'desc')

    const invoiceAmounts = await Document.query()
      .where({ type: 'invoice', organizationId: ctx.auth.user?.organization.id, status: 'paid' })
      .select(Database.raw(`sum((data->>'total')::float) as total`))
      .select(Database.raw(`sum((data->>'net')::float) as net`))
      .first()

    const offerAmounts = await Document.query()
      .where({ type: 'offer', organizationId: ctx.auth.user?.organization.id, status: 'accepted' })
      .select(Database.raw(`sum((data->>'total')::float) as total`))
      .select(Database.raw(`sum((data->>'net')::float) as net`))
      .first()

    const reminderAmounts = await Document.query()
      .where({
        type: 'reminder',
        organizationId: ctx.auth.user?.organization.id,
        status: 'pending',
      })
      .select(Database.raw(`sum((data->>'total')::float) as total`))
      .select(Database.raw(`sum((data->>'net')::float) as net`))
      .first()

    return {
      invoices: {
        net: invoiceAmounts?.$extras.net,
        total: invoiceAmounts?.$extras.total,
        pending: pendingInvoices,
      },
      reminders: {
        pending: pendingReminders,
        total: reminderAmounts?.$extras.total,
        net: reminderAmounts?.$extras.net,
      },

      offers: {
        net: offerAmounts?.$extras.net,
        total: offerAmounts?.$extras.total,
        pending: pendingOffers,
      },
    }
  }
}
