import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Document from 'App/Models/Document'
import { DocumentValidator } from 'App/Validators/Document'
import NumberService from 'App/Services/Number'

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
      .withCount('reminders', (query) => query.as('totalReminders'))
      .withScopes((scopes) => scopes.sortBy(ctx, Document.$columnsDefinitions))
      .withScopes((scopes) => scopes.filterBy(ctx, Document.$columnsDefinitions))
      .paginate(ctx.request.qs()['page'] || 1, ctx.request.qs()['perPage'] || 20)
  }

  public async store(ctx: HttpContextContract) {
    const body = await ctx.request.validate(DocumentValidator)
    body.number = await NumberService.document(ctx.auth.user!, ctx.request.qs()['type'])
    return await Document.create({
      ...body,
      type: ctx.request.qs()['type'].toLowerCase(),
      organizationId: ctx.auth.user?.organizationId,
    })
  }

  public async update(ctx: HttpContextContract) {
    const io = await Document.query()
      .where({ id: ctx.request.param('id'), organizationId: ctx.auth.user?.organizationId })
      .firstOrFail()
    io.merge(await ctx.request.validate(DocumentValidator))
    await io.save()
    return io
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
      .firstOrFail()
  }

  public async duplicate(ctx: HttpContextContract) {
    const io = await Document.query()
      .where({ id: ctx.request.param('id'), organizationId: ctx.auth.user?.organizationId })
      .firstOrFail()

    const duplicate = new Document()
    duplicate.fill(io.$attributes)
    duplicate.number = await NumberService.document(ctx.auth.user!, io.type)

    delete duplicate.$attributes.id
    delete duplicate.$attributes.created_at
    delete duplicate.$attributes.updated_at

    return await duplicate.save()
  }
}
