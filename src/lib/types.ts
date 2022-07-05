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

export interface RoundelFodder {
  letters:      string
  datestr?:     string
  updatedAt?:   string
  gooduns?:     string[] | Guess[]
  nogos?:       string[] | Guess[]
  ol?:          boolean
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
  gooduns?:     string[]
  nogos?:       string[]
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

export interface RoundelPrefs {
  sortAxis:     string
  search:       string
}

export interface RoundelGlobals {
  playerIDs:    string[]
}

export interface LexMatches {
  words:    string[]
  topScore: number
  grouped:  { [key: string]: string[] }
  nums:     { [key: string]: number }
  num:      number
}

export type sortAxis = 'title' |'Rtitle' |'date' |'Rdate' |'played' |'Rplayed' |'score' |'Rscore' |'points' |'Rpoints' |'words' | 'Rwords'

export interface RoundelSorting {
  icon:     string
  dir:      "asc" | "desc"
  by:       string | ((sk: RoundelSketch) => (number | string))
  nextAxis: sortAxis
}

export type GuessFlavor = 'bogon' | 'nomain' | 'shorty' | 'pang' | 'comn' | 'obsc'
