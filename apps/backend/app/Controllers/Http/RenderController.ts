import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Template from 'App/Models/Template'
import Renderer from 'App/Services/Renderer'
import RenderValidator from 'App/Validators/Render'

export default class RenderController {
  public async store(ctx: HttpContextContract) {
    const body: any = await ctx.request.validate(RenderValidator)
    const org = ctx.auth.user!.organization
    const template = await Template.query()
      .if(
        body.templateId,
        (query) => {
          query
            .where({ id: body.templateId, organizationId: org.id })
            .orWhere({ id: body.templateId, organizationId: null })
        },
        (query) => query.where({ organizationId: null })
      )
      .firstOrFail()

    const preview = ctx.request.qs()['preview'] || false
    const html = Renderer.prepareHtml(ctx.auth.user!, template, body.data)

    return await Renderer.generatePDFOrImage(html, preview, 1)
  }
}
