import { BaseModel, scope } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'

export default class BaseAppModel extends compose(BaseModel, SoftDeletes) {
  public page = 1
  public perPage = 20

  private static hiddenFields = ['password', 'organizationId', 'rememberMeToken', 'deletedAt']
  private static operators = ['=', '!=', '<', '<=', '>', '>=', 'like', 'in', 'not in']

  private static fieldInColumns(field: string, columns: Map<string, any>): boolean {
    if (columns.get(field)) {
      return true
    }
    for (const [_, value] of columns.entries()) {
      if (value['columnName'] === field) {
        return true
      }
    }
    return false
  }

  private static allowedFilds(columns: Map<string, any>): string[] {
    const fields: string[] = []
    for (const [key, _] of columns.entries()) {
      if (this.hiddenFields.includes(key)) continue
      fields.push(key)
    }
    return fields
  }

  public static sortBy = scope((query, ctx: HttpContextContract, columns: Map<string, any>) =>
    query.if(
      ctx.request.qs()['sort'],
      (query) => {
        const sort = ctx.request.qs()['sort']
        if (typeof sort !== 'object') return
        for (const field in sort) {
          if (!this.fieldInColumns(field, columns)) throw new Exception(`Invalid sort field: ${field}. Allowed fields are [${this.allowedFilds(columns).join(', ')}]`, 400)
          let order = sort[field]
          if (!order || !['asc', 'desc'].includes(order.toLowerCase())) {
            order = 'asc'
          }
          query.orderBy(field, order).debug(true)
        }
      },
      //default sort
      (query) => query.orderBy('createdAt', 'desc')
    )
  )

  public static filterBy = scope((query, ctx: HttpContextContract, columns: Map<string, any>) =>
    query.if(ctx.request.qs()['filter'], (query) => {
      //TODO: throw validation errors
      const filter = ctx.request.qs()['filter']
      if (typeof filter !== 'object') throw new Exception('Invalid filter format. Use filter[field][operator]=value', 400)
      for (const field in filter) {
        const f = filter[field]
        if (typeof f !== 'object') throw new Exception('Invalid filter format. Use filter[field][operator]=value', 400)
        if (!this.fieldInColumns(field, columns)) throw new Exception(`Invalid filter field: ${field}. Allowed fields are [${this.allowedFilds(columns).join(', ')}]`, 400)
        const op = Object.keys(f)[0]
        let value = f[op]
        if (!this.operators.includes(op)) throw new Exception(`Invalid operator: ${op}. Allowed operators are [${this.operators.join(', ')}]`, 400)
        if (!value) continue
        if (op === 'like' && !value.includes('%')) {
          value = `%${value}%`
        }
        query.where(field, op, value)
      }
    })
  )
}
