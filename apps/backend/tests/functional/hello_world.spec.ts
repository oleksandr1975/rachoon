import { test } from '@japa/runner'
import parser from 'cron-parser'

test('display welcome page', async ({ client }) => {
  console.log(new Date())
  for (let i = 1; i <= 31; i++) {
    const cron = parser.parse(`0 0 * * ${i}`)
    const next = cron.next()
    console.log(i, next.toString(), next.toDate())
  }
})
