import { DateTime } from 'luxon'
import { column, belongsTo, BelongsTo, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import HashIDs from '../Helpers/hashids'
import BaseAppModel from './BaseAppModel'

export default class Template extends BaseAppModel {
  public serializeExtras() {
    return {
      isGlobal: this.organizationId === null,
    }
  }

  public static indexedFields = ['title']
  public isGlobal: boolean

  @column({ isPrimary: true, serialize: (val) => HashIDs.encode(val) })
  public id: number

  @column()
  public title: string

  @column()
  public default: boolean

  @column()
  public premium: boolean

  @column()
  public data: any

  @column()
  public html: string

  @column()
  public thumbnail: string

  @column({ serialize: (val) => HashIDs.encode(val) })
  public organizationId: number

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
