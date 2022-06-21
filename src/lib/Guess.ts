import _                from 'lodash'
import { Dicts }        from './Dicts'
import * as TY          from './types.js'

const Bowdlerizers = _.range(0, 15).map((len) => new RegExp(`^(.*?)(.{0,${len}})$`))

class Guess implements TY.Guess {
  word:     string
  len:      number
  score:    number
  isPan:    boolean
  scr:      boolean
  nyt:      boolean
  valid:    boolean
  hasMain:  boolean

  constructor(wd: string, roundel: TY.Roundel) {
    this.word    = wd.toLowerCase()
    this.len     = this.word.length
    this.isPan   = roundel.isPan(this.word)
    this.scr     = Dicts.isScr(this.word)
    this.nyt     = Dicts.isNyt(this.word)
    this.valid   = (this.scr || this.nyt)
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
    if (! this.nyt)     return 0
    if (this.len === 4) return 1
    return this.len + (this.isPan ? 7 : 0)
  }

  get nogo(): boolean {
    return ((! this.valid) || (! this.hasMain) || (this.len < 4))
  }

  get color(): string {
    if (! this.valid) return '#eecccc'
    if (this.isPan)   return '#ddddff'
    if (this.nyt)     return '#cceecc'
    return 'dddddd'
  }
}

export default Guess
