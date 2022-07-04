import _                                from 'lodash'
import FullWords                        from '../../data/FullWords.js'
import ComnWords                        from '../../data/ComnWords.js'
import * as TY                          from './types.js'

const Dicts = {
  full:          new Set<string>(FullWords),
  comn:          new Set<string>(ComnWords),
  full_wds:      FullWords,
  comn_wds:      ComnWords,
  //
  isFull:       (wd: string) => (Dicts.full.has(wd)),
  isComn:       (wd: string) => (Dicts.comn.has(wd)),
  isValid:      (wd: string) => ((Dicts.isComn(wd) || Dicts.isFull(wd))),


  lexMatches(lex: string, roundel: TY.Roundel): TY.LexMatches {

    const re  = new RegExp(`^(?=.*${roundel.letters[0]})[${roundel.letters}]{4,}$`)
    // @ts-ignore
    const words: string[]  = Dicts[`${lex}_wds`].filter((wd) => re.test(wd))
    const grouped: { [len: string]: string [] }  = _.groupBy(words, 'length')
    const topScore: number = words.reduce((tot, wd) => {
      if      (wd.length <   4) {
        return tot
      } else if (wd.length === 4) {
        return tot + 1
      } else if (roundel.pangRe.test(wd)) {
        return tot + wd.length + 7
      } else {
        return tot + wd.length
      }
    }, 0)
    const nums: { [len: string]: number } = {}
    _.range(4, 15).forEach((nn) => nums[nn] = (grouped[nn] || []).length) // eslint-disable-line
    //
    return { words, topScore, grouped, nums, num: words.length }
  },

  lexMatchesFor(re: RegExp, lex: TY.LexName) {
    const words: string[] = Dicts[`${lex}_wds`].filter((wd) => re.test(wd))
    return words
  },

  hasMatchFor(re: RegExp, lex: TY.LexName) {
    return (!! Dicts[`${lex}_wds`].find((wd) => re.test(wd)))
  },

}

// export default Dicts
export {
  FullWords,
  ComnWords,
  Dicts,
}
