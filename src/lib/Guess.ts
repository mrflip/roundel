import _                from 'lodash'
import { Dicts }        from './Dicts'
import * as TY          from './types.js'

const Bowdlerizers = _.range(0, 15).map((len) => new RegExp(`^(.*?)(.{0,${len}})$`))

export class Guess implements TY.Guess {
  word:     string
  len:      number
  score:    number
  pang:     boolean
  full:     boolean
  comn:     boolean
  valid:    boolean
  hasMain:  boolean

  constructor(wd: string, roundel: TY.Roundel) {
    this.word    = wd.toLowerCase()
    this.len     = this.word.length
    this.pang     = roundel.isPang(this.word)
    this.full    = Dicts.isFull(this.word)
    this.comn    = Dicts.isComn(this.word)
    this.valid   = (this.full || this.comn)
    this.hasMain = roundel.hasMain(this.word)
    this.score   = this.getScore()
  }

  revealed(reveal: number): string {
    if (! _.isNumber(reveal)) { return this.word }
    const stars   = _.padEnd('', (this.len - reveal), '*')
    if (reveal <= 0) { return stars }
    const bowler  = Bowdlerizers[reveal] || Bowdlerizers[15]
    return this.word.replace(
      bowler,
      (_m, hide, show) => (stars + show)) // eslint-disable-line
  }

  getScore(): number {
    if (this.nogo)      return 0
    if (! this.comn)     return 0
    if (this.len === 4) return 1
    return this.len + (this.pang ? 7 : 0)
  }

  get nogo(): boolean {
    return ((! this.valid) || (! this.hasMain) || (this.len < 4))
  }

  get flavor(): TY.GuessFlavor {
    if (! this.valid)   { return 'bogon' }
    if (! this.hasMain) { return 'nomain' }
    if (this.len < 4)   { return 'shorty' }
    if (this.pang)      { return 'pang' }
    if (this.comn)      { return 'comn' }
    return 'obsc'
  }
}

export default Guess
