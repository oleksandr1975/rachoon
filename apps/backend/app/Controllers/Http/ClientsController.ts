import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientValidator from 'App/Validators/Client'
import Client from '../../Models/Client'
import Numberervice from 'App/Services/Number'

export default class ClientsController {
  public async index(ctx: HttpContextContract) {
    if (ctx.request.qs()['count']) {
      return await Client.query()
        .where({ organizationId: ctx.auth.user?.organizationId })
        .getCount()
    }
    return await Client.query()
      .where({ organizationId: ctx.auth.user?.organizationId })
      .withCount('invoices', (query) => query.as('totalInvoices'))
      .withCount('invoices', (query) => query.where({ status: 'pending' }).as('pendingInvoices'))
      .withCount('offers', (query) => query.as('totalOffers'))
      .withCount('reminders', (query) => query.as('totalReminders'))
      .withCount('offers', (query) => query.where({ status: 'pending' }).as('pendingOffers'))
      .withScopes((scopes) => scopes.sortBy(ctx, Client))
      .withScopes((scopes) => scopes.filterBy(ctx, Client))
      .withScopes((scopes) => scopes.searchBy(ctx, Client))

      .paginate(ctx.request.qs()['page'] || 1, ctx.request.qs()['perPage'] || 20)
  }

  public async store(ctx: HttpContextContract) {
    const body = await ctx.request.validate(ClientValidator)
    body.number = await Numberervice.client(ctx.auth.user!.organizationId)
    return await Client.create({
      ...body,
      organizationId: ctx.auth.user?.organizationId,
    })
  }

  public async destroy(ctx: HttpContextContract) {
    return (
      await Client.query()
        .where({
          organizationId: ctx.auth.user?.organization.id,
          id: ctx.request.param('id'),
        })
        .firstOrFail()
    ).delete()
  }

  public async update(ctx: HttpContextContract) {
    const body = await ctx.request.validate(ClientValidator)
    return await Client.query()
      .where({ id: ctx.request.param('id'), organizationId: ctx.auth.user?.organizationId })
      .update({
        ...body,
      })
  }

  public async show(ctx: HttpContextContract) {
    return await Client.query()
      .where({ id: ctx.request.param('id'), organizationId: ctx.auth.user?.organizationId })
      .firstOrFail()
  }
}
