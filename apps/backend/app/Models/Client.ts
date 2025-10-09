import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import HashIDs from 'App/Helpers/hashids'
import Document from './Document'
import BaseAppModel from './BaseAppModel'

export default class Client extends BaseAppModel {
  public static indexedFields = ['name', 'number']
  public serializeExtras() {
    return {
      totalInvoices: Number(this.$extras.totalInvoices || 0),
      pendingInvoices: Number(this.$extras.pendingInvoices || 0),
      totalOffers: Number(this.$extras.totalOffers || 0),
      pendingOffers: Number(this.$extras.pendingOffers || 0),
      invoicesTotal: Number(this.$extras.invoicesTotal || 0),
      totalReminders: Number(this.$extras.totalReminders || 0),
    }
  }
  public totalInvoices: number
  public totalOrders: number
  public totalReminders: number
  public total: number
  public net: number
  @column({ isPrimary: true, serialize: (val) => HashIDs.encode(val) })
  public id: number

  @column()
  public name: string

  @column()
  public number: string

  @column()
  public data: any

  @column({ serialize: (val) => HashIDs.encode(val) })
  public organizationId: number

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @hasMany(() => Document, {
    onQuery: (query) => {
      return query.where({ type: 'invoice' })
    },
  })
  public invoices: HasMany<typeof Document>

  @hasMany(() => Document, {
    onQuery: (query) => {
      return query.where({ type: 'offer' })
    },
  })
  public offers: HasMany<typeof Document>

  @hasMany(() => Document, {
    onQuery: (query) => {
      return query.where({ type: 'reminder' })
    },
  })
  public reminders: HasMany<typeof Document>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
