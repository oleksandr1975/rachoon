import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'

class DocumentValidator {
  public schema = schema.create({
    clientId: schema.number(),
    number: schema.string(),
    status: schema.string(),
    offerId: schema.number.optional(),
    templateId: schema.number.optional(),
    invoiceId: schema.number.optional(),
    recurringInvoice: schema.object.optional().anyMembers(),
    data: schema.object().members({
      positions: schema.array().members(schema.object().anyMembers()),
      discountsCharges: schema.array.optional().members(schema.object().anyMembers()),
      taxes: schema.object().anyMembers(),
      taxOption: schema.object().anyMembers(),
      date: schema.date(),
      dueDate: schema.date(),
      headingText: schema.string.optional(),
      footerText: schema.string.optional(),
      total: schema.number(),
      net: schema.number(),
      netNoDiscount: schema.number(),
      dueDays: schema.number(),
    }),
  })

  public messages: CustomMessages = {}
}

class StatusValidator {
  public schema = schema.create({
    status: schema.string(),
  })
  public messages: CustomMessages = {}
}

export { DocumentValidator, StatusValidator }
