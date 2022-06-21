
export interface Roundel {
  letters:      string
  words:        string[]
}

export interface Answer {
  word:     string
  len:      number
  isPan:    boolean
  scr:      boolean
  nyt:      boolean
  valid:    boolean
  hasMain:  boolean
  score:    number
  nogo:     number
  color:    string

  revealed(number): string

  getScore(): number

}
