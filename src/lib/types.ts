export type LexName = 'nyt' | 'scr'

export interface Roundel {
  letters:      string
  datestr:      string
  updatedAt:    string
  mainLetter:   string
  pangramRe:     RegExp
  rejectRe:     RegExp
  guesses:      Guess[]
  nogos:        Guess[]
  hints:        Guess[]
  dispLtrs:     string

  _lexMatches: { [letters: string]: any }
  _allWords:    string[]

  hasMain(str: string): boolean
  isPan(word: string): boolean
  lexMatches(lex: LexName): LexMatches
}

export interface Guess {
  word:     string
  len:      number
  score:    number
  isPan:    boolean
  scr:      boolean
  nyt:      boolean
  valid:    boolean
  hasMain:  boolean
  nogo:     boolean
  color:    string

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
