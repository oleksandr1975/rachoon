import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PaginationHeaders {
  public async handle({ response }: HttpContextContract, next: () => Promise<void>) {
    await next()
    const body = response.lazyBody[0]

    if (body && body.constructor.name === 'ModelPaginator') {
      response.header('X-Total', body['total'])
      response.header('X-Pages', body['lastPage'])
      response.header('X-Page', body['currentPage'])
      response.header('X-Per-Page', body['perPage'])
      response.json(body['rows'])
    }
  }
}
