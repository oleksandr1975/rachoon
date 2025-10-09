import { BaseModel, scope } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'

export default class BaseAppModel extends compose(BaseModel, SoftDeletes) {
  public page = 1
  public perPage = 20

  public static indexedFields: string[] = []

  private static operators = ['=', '!=', '<', '<=', '>', '>=', 'like', 'in', 'not in']

  private static getColumnAndProps(field: string) {
    let column = field
    let props = ''
    if (field.includes('.')) {
      const split = field.split('.')
      column = split[0]
      props = split
        .slice(1)
        .map((p) => `->>'${p}'`)
        .join('')
    }

    return [column, props]
  }

  public static sortBy = scope((query, ctx: HttpContextContract, model: typeof BaseAppModel) =>
    query.if(
      ctx.request.qs()['sort'],
      (query) => {
        const sort = ctx.request.qs()['sort']
        if (typeof sort !== 'object') return
        for (const field in sort) {
          const [column, props] = this.getColumnAndProps(field)

          if (!model.indexedFields.includes(field) && !field.includes('.'))
            throw new Exception(
              `Invalid sort field: ${field}. Allowed fields are [${model.indexedFields.join(
                ', '
              )}]`,
              400
            )
          let order = sort[field]
          if (!order || !['asc', 'desc'].includes(order.toLowerCase())) {
            order = 'asc'
          }
          if (props !== '') {
            query.orderByRaw(`${column}${props} ${order}`)
          } else {
            query.orderBy(field, order)
          }
        }
      },
      //default sort
      (query) => query.orderBy('createdAt', 'desc')
    )
  )

  public static searchBy = scope((query, ctx: HttpContextContract, model: typeof BaseAppModel) =>
    query.if(ctx.request.qs()['q'] && ctx.request.qs()['q'] !== '', (query) => {
      query.andWhere((q) => {
        const fields = model.indexedFields || []
        for (const field of fields) {
          const [column, props] = this.getColumnAndProps(field)
          if (props !== '') {
            q.orWhereRaw(`${column}${props} ILIKE ?`, [`%${ctx.request.qs()['q']}%`])
          } else {
            q.orWhereRaw(`LOWER(${column}) like ?`, [`%${ctx.request.qs()['q'].toLowerCase()}%`])
          }
        }
      })
    })
  )

  public static filterBy = scope((query, ctx: HttpContextContract, model: typeof BaseAppModel) =>
    query.if(ctx.request.qs()['filter'], (query) => {
      //TODO: throw validation errors
      const filter = ctx.request.qs()['filter']
      if (typeof filter !== 'object')
        throw new Exception('Invalid filter format. Use filter[field][operator]=value', 400)
      for (const field in filter) {
        // const [column, props] = this.getColumnAndProps(field)
        const f = filter[field]
        if (typeof f !== 'object')
          throw new Exception('Invalid filter format. Use filter[field][operator]=value', 400)
        if (!model.indexedFields.includes(field))
          throw new Exception(
            `Invalid filter field: ${field}. Allowed fields are [${model.indexedFields.join(
              ', '
            )}]`,
            400
          )
        const op = Object.keys(f)[0]
        let value = f[op]
        if (!this.operators.includes(op))
          throw new Exception(
            `Invalid operator: ${op}. Allowed operators are [${this.operators.join(', ')}]`,
            400
          )
        if (!value) continue
        if (op === 'like' && !value.includes('%')) {
          value = `%${value}%`
        }
        query.where(field, op, value)
      }
    })
  )
}
