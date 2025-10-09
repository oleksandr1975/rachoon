import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Document from 'App/Models/Document'
import { DocumentValidator } from 'App/Validators/Document'
import NumberService from 'App/Services/Number'
import DocumentService from 'App/Services/Document'
import RecurringInvoice from 'App/Models/RecurringInvoice'

export default class DocumentsController {
  public async index(ctx: HttpContextContract) {
    if (!['invoice', 'offer', 'reminder'].includes(ctx.request.qs()['type'])) {
      return ctx.response.badRequest('Type must be invoice or offer')
    }

    if (ctx.request.qs()['count']) {
      return await Document.query()
        .where({
          organizationId: ctx.auth.user?.organizationId,
          type: ctx.request.qs()['type'].toLowerCase(),
        })
        .withTrashed()
        .getCount()
    }
    return await Document.query()
      .where({
        organizationId: ctx.auth.user?.organizationId,
        type: ctx.request.qs()['type'].toLowerCase(),
      })
      .if(ctx.request.qs()['clientId'], (query) => {
        query.where('client_id', ctx.request.qs()['clientId'])
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .preload('recurringInvoice')
      .withCount('reminders', (query) => query.as('totalReminders'))
      .withScopes((scopes) => scopes.sortBy(ctx, Document))
      .withScopes((scopes) => scopes.filterBy(ctx, Document))
      .withScopes((scopes) => scopes.searchBy(ctx, Document))
      .paginate(ctx.request.qs()['page'] || 1, ctx.request.qs()['perPage'] || 20)
  }

  public async store(ctx: HttpContextContract) {
    const body = await ctx.request.validate(DocumentValidator)
    body.number = await NumberService.document(
      ctx.auth.user!.organizationId,
      ctx.request.qs()['type']
    )
    const document = await Document.create({
      ...body,
      type: ctx.request.qs()['type'].toLowerCase(),
      organizationId: ctx.auth.user?.organizationId,
    })

    if (body.recurringInvoice) {
      const recurringInvoice = new RecurringInvoice()
      recurringInvoice.fill(body.recurringInvoice)
      recurringInvoice.$attributes.organizationId = ctx.auth.user!.organizationId
      recurringInvoice.$attributes.invoiceId = document.id
      const r = await recurringInvoice.save()
    }

    return document
  }

  public async update(ctx: HttpContextContract) {
    const d = await Document.query()
      .where({ id: ctx.request.param('id'), organizationId: ctx.auth.user?.organizationId })
      .firstOrFail()
    const body = await ctx.request.validate(DocumentValidator)
    d.merge(body)
    await d.save()
    if (body.recurringInvoice) {
      const recurringInvoice = await RecurringInvoice.query()
        .where({ id: body.recurringInvoice.id, organizationId: ctx.auth.user!.organizationId })
        .firstOrFail()
      recurringInvoice.fill(body.recurringInvoice)
      await recurringInvoice.save()
    }

    return d
  }

  public async destroy(ctx: HttpContextContract) {
    return (
      await Document.query()
        .where({
          organizationId: ctx.auth.user?.organization.id,
          id: ctx.request.param('id'),
        })
        .firstOrFail()
    ).delete()
  }

  public async show(ctx: HttpContextContract) {
    return await Document.query()
      .where({ id: ctx.request.param('id'), organizationId: ctx.auth.user?.organizationId })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .preload('recurringInvoice')
      .firstOrFail()
  }

  public async duplicate(ctx: HttpContextContract) {
    return await DocumentService.duplicate(
      ctx,
      ctx.request.param('id'),
      ctx.auth.user!.organizationId
    )
  }
}
