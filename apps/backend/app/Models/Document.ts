import { DateTime } from 'luxon'
import { Document as CommonDocument, DocumentData } from '@repo/common/Document'
import { isPast } from 'date-fns'
import {
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Organization from './Organization'
import HashIDs from 'App/Helpers/hashids'
import Template from './Template'
import BaseAppModel from './BaseAppModel'
import RecurringInvoice from './RecurringInvoice'

export default class Document extends BaseAppModel {
  public serializeExtras() {
    return {
      totalReminders: Number(this.$extras.totalReminders || 0),
    }
  }

  public totalReminders: number
  public static indexedFields = ['number', 'status', 'data.dueDate', 'data.net', 'data.total']

  @computed()
  public get overdue() {
    return isPast(this.data.dueDate)
  }

  @computed()
  public get isFromRecurring() {
    return !!this.recurringId
  }

  @computed()
  public get isRecurring() {
    return !!this.recurringInvoice
  }

  @beforeSave()
  public static async calculate(document: Document) {
    const d = new CommonDocument(document.serialize())
    d.calculate()
    document.data = d.data as DocumentData
  }
  @column({ isPrimary: true, serialize: (val) => HashIDs.encode(val) })
  public id: number

  @column()
  public number: string

  @column()
  public status: string

  @column()
  public type: string

  @column()
  public data: DocumentData

  @column()
  public recurring: boolean

  @column()
  public recurringData: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({ serialize: (val) => HashIDs.encode(val) })
  public clientId: number

  @belongsTo(() => Client)
  public client: BelongsTo<typeof Client>

  @column({ serialize: (val) => HashIDs.encode(val) })
  public organizationId: number

  @column({ serialize: (val) => HashIDs.encode(val) })
  public templateId: number

  @column({ serialize: (val) => HashIDs.encode(val) })
  public invoiceId: number

  @column({ serialize: (val) => HashIDs.encode(val) })
  public recurringId: number

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @hasOne(() => Template)
  public template: HasOne<typeof Template>

  @column()
  public offerId: number

  @belongsTo(() => Document, { foreignKey: 'offerId' })
  public offer: BelongsTo<typeof Document>

  @hasOne(() => RecurringInvoice, { foreignKey: 'invoiceId' })
  public recurringInvoice: HasOne<typeof RecurringInvoice>

  @hasMany(() => Document, { foreignKey: 'offerId' })
  public invoices: HasMany<typeof Document>

  @hasMany(() => Document, { foreignKey: 'invoiceId' })
  public reminders: HasMany<typeof Document>
}
