import _           /**/ from 'lodash'
import moment           from 'moment'
import { sprintf }      from 'sprintf-js'
import Guess            from './Guess.js'
import { Dicts }        from './Dicts.js'
import * as TY          from './types.js'

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])

export class Roundel implements TY.Roundel {
  letters:      string
  datestr:      string
  updatedAt:    string
  mainLetter:   string
  pangRe:       RegExp
  rejectRe:     RegExp
  gooduns:      TY.Guess[]
  nogos:        TY.Guess[]
  hints:        Guess[]
  dispLtrs:     string
  ol:           boolean

  _lexMatches: { [letters: string]: any }
  _allWords!:   string[]

  constructor(ltrs: string, obj: Partial<TY.RoundelFodder> = {}) {
    this.letters     = Roundel.normalize(ltrs)
    this.datestr     = (obj.datestr   || Roundel.getDatestr())
    this.updatedAt   = (obj.updatedAt || moment().format('YYYYMMDD'))
    //
    this.mainLetter  = this.letters[0]  //eslint-disable-line
    this.pangRe      = Roundel.makePangRe(this.letters)
    this.rejectRe    = Roundel.makeRejectRe(this.letters)
    //
    // @ts-ignore
    this.gooduns = (obj.gooduns)
    // @ts-ignore
      ? obj.gooduns.map((gg: any) => new Guess(gg, this))
      : []
    // @ts-ignore
    this.nogos   = (obj.nogos)
    // @ts-ignore
      ? obj.nogos.map((gg: any)   => new Guess(gg, this))
      : []
    this._lexMatches = {}
    this.hints       = this.getHints()
    this.dispLtrs    = Roundel.dispLtrs(this.letters)
    this.ol         = (!! obj.ol)
  }

  resetGooduns() {
    this.gooduns = []
    this.nogos   = []
    this.hints   = this.getHints()
  }

  static getDatestr(date: number = _.now()) {
    const dt = new Date(date)
    return sprintf("%04d%02d%02d", dt.getFullYear(), 1 + dt.getMonth(), dt.getDate())
  }

  static normalize(ltrs: string) {
    const lonly = ltrs.replace(/[^A-Za-z]/g, '')
    const larr  = lonly.toLowerCase().split('')
    const luniq = [...new Set(larr)].slice(0, 7)
    const firl  = luniq.shift()
    luniq.sort((aa, bb) => {
      if (VOWELS.has(aa) && ! VOWELS.has(bb)) return -1
      if (VOWELS.has(bb) && ! VOWELS.has(aa)) return 1
      return ((aa > bb) ? 1 : -1)
    })
    return [firl, ...luniq].join('')
  }

  static attemptable(letters: string) {
    if (letters.length !== 7) { return false }
    const pangReStr = letters.split('').map((ltr) => `(?=.*${ltr})`).join('')
    const pangRe = RegExp(`${pangReStr}(^[${letters}]+$)`, 'i')
    return Dicts.hasMatchFor(pangRe, 'full')
  }

  static dispLtrs(letters: string): string {
    const la = letters.toUpperCase().split('')
    return [la.shift(), '/', ...la].join(' ')
  }

  get larry(): string[] {
    return this.letters.split('')
  }

  get upltrs(): string[] {
    return this.larry.map((ltr) => ltr.toUpperCase())
  }

  get dashedLetters(): string {
    return `${this.letters.slice(0, 1)} / ${this.letters.slice(1)}`.toUpperCase()
  }

  isPang(word: string): boolean {
    return this.pangRe.test(word)
  }

  totScore(): number {
    return this.gooduns.reduce((tot, guess) => (tot + guess.score), 0)
  }

  fullScore(): number {
    return this.gooduns.reduce((tot, guess) => (tot + guess.fullScore), 0)
  }

  pangScore(wd: string): number {
    return (wd.length + (this.isPang(wd) ? 7 : 0))
  }

  hasWord(word: string): boolean {
    return this.gooduns.some((guess)  => (guess.word === word))
      || this.nogos.some((guess) => (guess.word === word))
  }

  hasMain(wd: string): boolean {
    return wd.includes(this.mainLetter)
  }

  static makePangRe(letters: string): RegExp {
    return new RegExp(letters.split('').map((ltr) => `(?=.*${ltr})`).join(''), 'i')
  }

  static makeRejectRe(letters: string): RegExp {
    return new RegExp(`[^${letters}]`, 'gi')
  }

  normEntry(text: string):string {
    return text.toLowerCase().replace(this.rejectRe, '')
  }

  getHints(): Guess[] {
    this.hints = (this
      .allWords
      .filter((wd) => (wd.length >= 4))
      .filter((wd) => (! this.hasWord(wd)))
      // @ts-ignore
      .map((wd) => new Guess(wd.toLowerCase(), this))
    )
    return this.hints
  }

  get allWords() {
    if (! this._allWords) {
      const comn      = this.lexMatches('comn')
      const full      = this.lexMatches('full')
      this._allWords = _.sortedUniq(
        _.sortBy(full.words.concat(comn.words), ['length', _.identity]),
      )
    }
    return this._allWords
  }

  addGuess(wd: string) {
    if (wd.length === 0) { return {} }
    const word = wd.toLowerCase()
    // @ts-ignore
    const guess = new Guess(word, this)
    if (this.hasWord(word)) { return guess }
    if (guess.nogo) {
      this.nogos = this.nogos.concat(guess)
      // @ts-ignore
      this.nogos.sort(Roundel.byAlpha)
    } else {
      this.gooduns   = this.gooduns.concat([guess])
      this.hints     = this.hints.filter((hh) => hh.word !== wd)
      // @ts-ignore
      this.gooduns.sort(Roundel.byAlpha)
    }
    return guess
  }

  delGuess(wd: string) {
    this.gooduns   = this.gooduns.filter((guess) => guess.word !== wd)
    this.nogos     = this.nogos.filter((guess)   => guess.word !== wd)
    this.hints     = this.getHints()
  }

  static byAlpha(aa: Guess, bb: Guess): number {
    return (aa.word < bb.word ? -1 : 1)
  }

  static byScore(aa: Guess, bb: Guess): number {
    return (aa.score < bb.score ? -1 : Roundel.byAlpha(aa, bb))
  }

  goodunsByLen() {
    // @ts-ignore
    return Roundel.sectionListify(this.gooduns, this)
  }

  hintsByLen() {
    // @ts-ignore
    return Roundel.sectionListify(this.hints, this)
  }

  static sectionListify(gooduns: TY.Guess[], roundel: TY.Roundel) {
    const { nums:comn_nums } = roundel.lexMatches('comn') // don't do this (passing in the obj)
    const { nums:full_nums } = roundel.lexMatches('full')
    return _(gooduns)
      .groupBy('len')
      .map((gs, len) => ({
        key:   String(len),
        title: `${len}s`,
        stats: `(${gs.length}/${full_nums[len]} | ${gs.filter((gg) => gg.comn).length}/${comn_nums[len]})`,
        data: gs,
      }))
      .value()
  }

  // Try to guess the coordinates of the guess, so we can scroll to it.
  // This only kinda works and would need much more fiddling to get right.
  sectionForGuess(guess: TY.Guess) {
    const gBS          = this.goodunsByLen()
    const lens         = gBS.map((ll) => (ll.data[0].len))
    const sectionIndex = _.findIndex(lens, (len) => (len === guess.len))
    if (sectionIndex < 0) return null
    let itemIndex    = _.findIndex(gBS[sectionIndex].data, (gg) => (gg.word === guess.word))
    if (itemIndex < 0) { itemIndex = 0 }
    return ({ sectionIndex, itemIndex, viewPosition: 0.25 })
  }

  lexMatches(lex: TY.LexName) {
    if (! this._lexMatches[lex]) {
      // @ts-ignore
      this._lexMatches[lex] = Dicts.lexMatches(lex, this)
    }
    return this._lexMatches[lex]
  }

  summaryInfo(lex: TY.LexName) {
    const { grouped, topScore, num } = this.lexMatches(lex)
    const [count, roundelHist] = this.wordHist(lex)
    const totHist = Object
      .entries(grouped)
    // @ts-ignore
      .map(([len, vv]: [number, number[]]): [number, number][] => [Number(len), vv.length])
    // @ts-ignore
      .map(([len, vct]: [number, number]) => `${len}:${roundelHist.get(len)}/${vct || '-'}`)
      .join(' ')
    const totScore = this.totScore()
    return { totScore, topScore, count, num, totHist }
  }

  summary(lex: TY.LexName) {
    const {
      totScore, topScore,
      count, num, totHist,
    } = this.summaryInfo(lex)
    return `${totScore}/${topScore} (${count}/${num}): ${totHist}`
  }

  get ll()  { return this.letters }
  get dt()  { return this.datestr }
  get cp()  { return _.isEmpty(this.gooduns) ? undefined : this.totScore() }
  get fp()  { return _.isEmpty(this.gooduns) ? undefined : this.fullScore() }
  get cw()  { return _.filter(this.gooduns, 'comn').length }
  get fw()  { return _.filter(this.gooduns, 'full').length }
  get cpx() { return this.lexMatches('comn').topScore }
  get cwx() { return this.lexMatches('comn').num      }
  get fpx() { return this.lexMatches('full').topScore }
  get fwx() { return this.lexMatches('full').num      }
  get up()  { return this.updatedAt }

  get sketch() {
    const { letters:                   ll, dt, ol, cp, cpx, cw, cwx, fp, fpx, fw, fwx, up } = this
    const sketch: TY.RoundelSketch = { ll, dt, ol, cp, cpx, cw, cwx, fp, fpx, fw, fwx, up }
    if (! (_.isEmpty(this.gooduns))) {
      sketch.gooduns = this.gooduns.map((gg) => gg.word)
      sketch.nogos   = this.nogos.map((gg) => gg.word)
    }
    return _.omitBy(sketch, _.isNil) as TY.RoundelSketch
  }

  get pangGooduns() {
    return _.filter(this.gooduns, 'isPang')
  }

  sundaySummary() {
    const sunCount = _.filter(this.gooduns, ({ len }) => (len >= 5)).length
    const bingoCount = _.size(this.pangGooduns)
    const sunTot = sunCount + 2 * bingoCount
    return `${sunCount}+2*${bingoCount}=${sunTot}`
  }

  wordHist(lex: TY.LexName): [number, Map<number, number>] {
    const hist  = new Map<number, number>()
    let   count = 0
    _.range(0, 15).forEach((nn) => (hist.set(nn, 0))) // eslint-disable-line
    this.gooduns.forEach((guess) => {
      if (guess[lex]) {
        count += 1
        hist.set(guess.len, 1 + (hist.get(guess.len) || 0))
      }
    })
    return [count, hist]
  }

  serialize({ updatePlayed = true } = {}) {
    const updatedAt = updatePlayed ? moment().format('YYYYMMDD') : this.updatedAt
    return _.pickBy({
      letters:          this.letters.toUpperCase(),
      datestr:          this.datestr,
      updatedAt,
      gooduns:          this.gooduns.map((gg) => gg.word),
      nogos:            this.nogos.map((gg) => gg.word),
    })
  }

  serializeWithSummary() {
    const comnSummary = this.summaryInfo('comn')
    const fullSummary = this.summaryInfo('full')
    const { totScore:comnScore, topScore:comnMax } = comnSummary
    return {
      ...this.serialize(),
      comnScore,
      comnMax,
      comnFrac:          (Math.round(100 * (comnScore / comnMax)) || 0),
      comnSummary:       JSON.stringify(comnSummary),
      fullSummary:       JSON.stringify(fullSummary),
    }
  }

  static from(obj: TY.RoundelFodder): Roundel {
    return new Roundel(obj.letters!, obj)
  }

}

export default Roundel
