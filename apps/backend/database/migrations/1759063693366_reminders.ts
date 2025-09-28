import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reminders'

  public async up() {
    this.schema.alterTable('documents', (table) => {
      table
        .integer('invoice_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('documents')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable('documents', (table) => {
      table.dropColumn('invoice_id')
    })
  }
}
