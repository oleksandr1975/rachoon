import Sqids from 'sqids'

const alphababet =
  process.env.RACHOON_ALPHABET || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
export default class HashIDs {
  public static encode(val: number) {
    if (process.env.NODE_ENV === 'development') {
      return `${val}`
    }
    const hids = new Sqids({ minLength: 20, alphabet: alphababet })
    return hids.encode([val])
  }

  public static decode(val: string) {
    if (process.env.NODE_ENV === 'development') {
      return Number(val)
    }

    const hids = new Sqids({ minLength: 20, alphabet: alphababet })
    return Number(hids.decode(val)[0])
  }
}
