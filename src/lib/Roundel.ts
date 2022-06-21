import _           /**/ from 'lodash'
import { sprintf }      from 'sprintf-js'
import Guess            from './Guess.js'
import { Dicts }        from './Dicts.js'
import * as TY          from './types.js'

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])

class Roundel implements TY.Roundel {
  letters:      string
  datestr:      string
  updatedAt:    string
  mainLetter:   string
  pangramRe:     RegExp
  rejectRe:     RegExp
  guesses:      TY.Guess[]
  nogos:        TY.Guess[]
  hints:        Guess[]
  dispLtrs:     string

  _lexMatches: { [letters: string]: any }
  _allWords!:   string[]

  constructor(ltrs: string, obj: Partial<Roundel> = {}) {
    this.letters     = Roundel.normalize(ltrs)
    this.datestr     = (obj.datestr   || Roundel.getDatestr())
    this.updatedAt   = (obj.updatedAt || '')
    //
    this.mainLetter  = this.letters[0]  //eslint-disable-line
    this.pangramRe   = Roundel.makePangramRe(this.letters)
    this.rejectRe    = Roundel.makeRejectRe(this.letters)
    //
    // @ts-ignore
    this.guesses = (obj.guesses)
    // @ts-ignore
      ? obj.guesses.map((gg: any) => new Guess(gg, this))
      : []
    // @ts-ignore
    this.nogos   = (obj.nogos)
    // @ts-ignore
      ? obj.nogos.map((gg: any)   => new Guess(gg, this))
      : []
    this._lexMatches = {}
    this.hints       = this.getHints()
    this.dispLtrs    = Roundel.dispLtrs(this.letters)
  }

  resetGuesses() {
    this.guesses = []
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

  static dispLtrs(letters: string): string {
    const la = letters.toUpperCase().split('')
    return [la.shift(), '/', ...la].join(' ')
  }

  get larry(): string[] {
    return this.letters.split('')
  }

  isPan(word: string): boolean {
    return this.pangramRe.test(word)
  }

  totScore(): number {
    return this.guesses.reduce((tot, guess) => (tot + guess.score), 0)
  }

  panScore(wd: string): number {
    return (wd.length + (this.isPan(wd) ? 7 : 0))
  }

  hasWord(word: string): boolean {
    return this.guesses.some((guess)  => (guess.word === word))
      || this.nogos.some((guess) => (guess.word === word))
  }

  hasMain(wd: string): boolean {
    return wd.includes(this.mainLetter)
  }

  static makePangramRe(letters: string): RegExp {
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
      .map((wd) => new Guess(wd.toLowerCase(), this))
    )
    return this.hints
  }

  get allWords() {
    if (! this._allWords) {
      const nyt      = this.lexMatches('nyt')
      const scr      = this.lexMatches('scr')
      this._allWords = _.sortedUniq(
        _.sortBy(scr.words.concat(nyt.words), ['length', _.identity]),
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
      this.guesses   = this.guesses.concat([guess])
      this.hints     = this.hints.filter((hh) => hh.word !== wd)
      // @ts-ignore
      this.guesses.sort(Roundel.byAlpha)
    }
    return guess
  }

  delGuess(wd: string) {
    this.guesses   = this.guesses.filter((guess) => guess.word !== wd)
    this.nogos     = this.nogos.filter((guess)   => guess.word !== wd)
    this.hints     = this.getHints()
  }

  static byAlpha(aa: Guess, bb: Guess): number {
    return (aa.word < bb.word ? -1 : 1)
  }

  static byScore(aa: Guess, bb: Guess): number {
    return (aa.score < bb.score ? -1 : Roundel.byAlpha(aa, bb))
  }

  guessesByLen() {
    // @ts-ignore
    return Roundel.sectionListify(this.guesses, this)
  }

  hintsByLen() {
    // @ts-ignore
    return Roundel.sectionListify(this.hints, this)
  }

  static sectionListify(guesses: TY.Guess[], roundel: TY.Roundel) {
    const { nums:nyt_nums } = roundel.lexMatches('nyt') // don't do this (passing in the obj)
    const { nums:scr_nums } = roundel.lexMatches('scr')
    return _(guesses)
      .groupBy('len')
      .map((gs, len) => ({
        title: `${len}s (${gs.length}/${scr_nums[len]} | ${gs.filter((gg) => gg.nyt).length}/${nyt_nums[len]})`,
        data: gs,
      }))
      .value()
  }

  // Try to guess the coordinates of the guess, so we can scroll to it.
  // This only kinda works and would need much more fiddling to get right.
  sectionForGuess(guess: TY.Guess) {
    const gBS          = this.guessesByLen()
    const lens         = gBS.map((ll) => (ll.data[0].len))
    const sectionIndex = _.findIndex(lens, (len) => (len === guess.len))
    if (sectionIndex < 0) return null
    let itemIndex    = _.findIndex(gBS[sectionIndex].data, (gg) => (gg.word === guess.word))
    if (itemIndex < 0) { itemIndex = 0 }
    // console.log(lens, sectionIndex, gBS[sectionIndex], itemIndex)
    return ({ sectionIndex, itemIndex, viewPosition: 0.25 })
  }

  lexMatches(lex: TY.LexName) {
    if (! this._lexMatches[lex]) {
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
      .map(([len, vv]: [number, number[]]): [number, number][] => [len, vv.length])
    // @ts-ignore
      .map(([len, vct]: [number, number]) => `${len}:${roundelHist.get(len)}/${vct}`)
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

  get pangramGuesses() {
    return _.filter(this.guesses, ({ isPan }) => isPan)
  }

  sundaySummary() {
    const sunCount = _.filter(this.guesses, ({ len }) => (len >= 5)).length
    const bingoCount = _.size(this.pangramGuesses)
    const sunTot = sunCount + 2 * bingoCount
    return `${sunCount}+2*${bingoCount}=${sunTot}`
  }

  wordHist(lex: TY.LexName): [number, Map<number, number>] {
    const hist  = new Map<number, number>()
    let   count = 0
    _.range(0, 15).forEach((nn) => (hist.set(nn, 0))) // eslint-disable-line
    this.guesses.forEach((guess) => {
      if (guess[lex]) {
        count += 1
        hist.set(guess.len, 1 + (hist.get(guess.len) || 0))
      }
    })
    return [count, hist]
  }

  serialize() {
    return _.pickBy({
      letters:          this.letters.toUpperCase(),
      datestr:          this.datestr,
      updatedAt:        this.updatedAt,
      guesses:          this.guesses.map((gg) => gg.word),
      nogos:            this.nogos.map((gg) => gg.word),
    })
  }

  serializeWithSummary() {
    const nytSummary = this.summaryInfo('nyt')
    const scrSummary = this.summaryInfo('scr')
    const { totScore:nytScore, topScore:nytMax } = nytSummary
    return {
      ...this.serialize(),
      nytScore,
      nytMax,
      nytFrac:          (Math.round(100 * (nytScore / nytMax)) || 0),
      nytSummary:       JSON.stringify(nytSummary),
      scrSummary:       JSON.stringify(scrSummary),
    }
  }

  static from(obj: Partial<Roundel>) {
    return new Roundel(obj.letters!, obj)
  }

}

export default Roundel