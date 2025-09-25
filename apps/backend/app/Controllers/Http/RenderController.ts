import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Template from 'App/Models/Template'
import HtmlRenderer from 'App/Services/HtmlRenderer'
import Locale from '@repo/common/Locale'
import Format from '@repo/common/Format'
import RenderValidator from 'App/Validators/Render'
import nunjucks from 'nunjucks'

export default class RenderController {
  public async store(ctx: HttpContextContract) {
    const body: any = await ctx.request.validate(RenderValidator)
    const template = await Template.query()
      .where({ id: body.templateId, organizationId: ctx.auth.user?.organizationId })
      .orWhere({ id: body.templateId, organizationId: null })
      .firstOrFail()

    const loc = ctx.auth.user!.organization.settings.general.locale
    const cur = ctx.auth.user!.organization.settings.general.currency

    const t = (key: string, ...val: any): string => {
      return Locale.t(loc, key, val)
    }

    const currency = (value: any): string => Format.toCurrency(value, loc, cur)

    const date = (value: any): string => Format.date(value, loc)

    const longDate = (value: any): string => Format.longDate(value, loc)

    const finalHtml = nunjucks.renderString(template.html, {
      object: body.data,
      template: template,
      organization: ctx.auth.user!.organization,
      user: ctx.auth.user!,
      t: t,
      format: {
        currency: currency,
        date: date,
        longDate: longDate,
      },
    })

    const preview = ctx.request.qs()['preview'] || false

    const renderer = new HtmlRenderer()
    return await renderer.renderFromHtml(finalHtml, preview)
  }
}
