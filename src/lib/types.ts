export type LexName = 'comn' | 'full'

export interface Roundel {
  letters:      string
  datestr:      string
  updatedAt:    string
  mainLetter:   string
  pangRe:       RegExp
  rejectRe:     RegExp
  gooduns:      Guess[]
  nogos:        Guess[]
  hints:        Guess[]
  dispLtrs:     string
  upltrs:       string[]
  sketch:       RoundelSketch

  _lexMatches: { [letters: string]: any }
  _allWords:    string[]

  hasMain(str: string): boolean
  isPang(word: string): boolean
  lexMatches(lex: LexName): LexMatches
  serialize(): Partial<Roundel>
  summary(lex: LexName): string

  // static normEntry(word: string): string
}

export interface RoundelSketch {
  ll:           string
  dt:           string
  fp?:          number
  fpx:          number
  fw?:          number
  fwx:          number
  cp?:          number
  cpx:          number
  cw?:          number
  cwx:          number
  ol:           boolean
  up?:          string
}

export type RoundelsIndex = { [key: string]: RoundelSketch }

export interface Guess {
  word:         string
  len:          number
  score:        number
  fullScore:    number
  pang:         boolean
  full:         boolean
  comn:         boolean
  valid:        boolean
  hasMain:      boolean
  nogo:         boolean

  revealed(num: number): string

  getScore(): number

}

export interface LexMatches {
  words:    string[]
  topScore: number
  grouped:  { [key: string]: string[] }
  nums:     { [key: string]: number }
  num:      number
}

export type GuessFlavor = 'bogon' | 'nomain' | 'shorty' | 'pang' | 'comn' | 'obsc'
