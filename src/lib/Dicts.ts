import _                                from 'lodash'
import ScrabbleWords                    from '../../data/wl_us.json'
import NytWords                         from '../../data/dict_nyt.json'
import ObsWords                         from '../../data/dict_obs.json'
import * as TY                          from './types.js'

const Dicts = {
  scr:          new Set<string>(ScrabbleWords),
  nyt:          new Set<string>(NytWords),
  obs:          new Set<string>(ObsWords),
  scr_wds:      ScrabbleWords,
  nyt_wds:      NytWords,
  //
  isScr:        (wd: string) => (Dicts.scr.has(wd)),
  isNyt:        (wd: string) => (Dicts.nyt.has(wd)),
  isValid:      (wd: string) => ((Dicts.isNyt(wd) || Dicts.isScr(wd))),


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
      } else if (roundel.pangramRe.test(wd)) {
        return tot + wd.length + 7
      } else {
        return tot + wd.length
      }
    }, 0)
    const nums: { [len: string]: number } = {}
    _.range(4, 15).forEach((nn) => nums[nn] = (grouped[nn] || []).length) // eslint-disable-line
    //
    return { words, topScore, grouped, nums, num: words.length }
  }
}

// export default Dicts
export {
  ScrabbleWords,
  NytWords,
  ObsWords,
  Dicts,
}
