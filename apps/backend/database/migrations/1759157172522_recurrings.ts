import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'recurring_invoices'
  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('invoice_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('documents')
        .onDelete('CASCADE')
      table.string('cron', 20).notNullable()
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE')

      table.date('deleted_at').nullable()
      table.date('start_date').notNullable()
      table.date('next_run').notNullable()
      table.boolean('active').notNullable().defaultTo(false)

      table.index('start_date')
      table.index('next_run')
      table.index('active')
      table.unique(['organization_id', 'invoice_id'])
    })

    this.schema.alterTable('documents', (table) => {
      table
        .integer('recurring_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(this.tableName)
        .onDelete('SET NULL')

      table.index('recurring_id')
      table.index('created_at')
    })
  }

  public async down() {
    this.schema.alterTable('documents', (table) => {
      table.dropIndex('recurring_id')
      table.dropColumn('recurring_id')
    })
    this.schema.dropTable(this.tableName)
  }
}
