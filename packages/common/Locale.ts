import { sprintf } from 'sprintf-js'
export default class Locale {
  public static messages = {
    'en': {
      'invoice': 'invoice',
      'reminder': 'reminder',
      'offer': 'offer',
      'number': 'number',
      'no': 'No.',
      'date': 'date',
      'due on': 'due on',
      'your VAT': 'your VAT',
      'pos': 'pos',
      'duration': 'duration',
      'description': 'description',
      'quantity': 'quantity',
      'unit price': 'unit price',
      'total price': 'total price',
      'subtotal': 'subtotal',
      'net': 'net',
      'incl. tax': 'incl. tax',
      'total': 'total',
      'user': 'user',
      'sum total': 'sum total',
      'duration total': 'duration total',
      'payment conditions': 'Payment conditions',
      'Payment within %d days': 'Payment within %d days',
    },
    'de-AT': {
      'invoice': 'Rechnung',
      'reminder': 'Mahnung',
      'offer': 'Angebot',
      'number': 'Nummer',
      'no': 'Nr.',
      'date': 'Datum',
      'due on': 'fällig am',
      'your VAT': 'Ihre USt-Id',
      'pos': 'Pos',
      'duration': 'Dauer',
      'description': 'Beschreibung',
      'quantity': 'Menge',
      'unit price': 'Einzelpreis',
      'total price': 'Gesamtpreis',
      'subtotal': 'Zwischensumme',
      'net': 'Netto',
      'incl. tax': 'zzgl. USt',
      'total': 'Brutto',
      'user': 'User',
      'sum total': 'Gesamt-Summe',
      'duration total': 'Gesamt-Dauer',
      'Payment conditions': 'Zahlungskonditionen',
      'Payment within %d days.': 'Zahlung innerhalb von %d Tagen.',
    },
  }

  public static t(loc: string, key: string, ...val: any): string {
    return this.messages[loc]
      ? sprintf(this.messages[loc][key], val || null) ??
      sprintf(this.messages['en'][key], val || null)
      : key
  }
}
