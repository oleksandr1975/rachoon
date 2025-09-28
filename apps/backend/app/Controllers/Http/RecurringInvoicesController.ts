import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import parser from 'cron-parser'

export default class AuthController {
  public async index(ctx: HttpContextContract) {
    for (let i = 1; i <= 31; i++) {
      // const cron = parser.parse(`0 0 * * ${i}`)
      const cron = parser.parse(`0 0 ${i} * *`)
      const next = cron.next()
      console.log(i, next.toString(), next.toDate())
    }
  }
}
