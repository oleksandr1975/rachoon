import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NumberService from 'App/Services/Number'

export default class AuthController {
  public async index(ctx: HttpContextContract) {
    const type = ctx.request.param('type')
    if (!['invoice', 'offer', 'reminder', 'client'].includes(type)) {
      return ctx.response.badRequest('Type must be invoice or offer')
    }

    if (type === 'client') {
      return NumberService.client(ctx.auth.user!)
    }

    return NumberService.document(ctx.auth.user!, type)
  }
}
