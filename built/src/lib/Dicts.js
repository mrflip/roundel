import _ from 'lodash';
import FullWords from '../../data/dict_full.json' assert { type: 'json' };
import ComnWords from '../../data/dict_comn.json' assert { type: 'json' };
import ObscWords from '../../data/dict_obsc.json' assert { type: 'json' };
const Dicts = {
    full: new Set(FullWords),
    comn: new Set(ComnWords),
    obsc: new Set(ObscWords),
    full_wds: FullWords,
    comn_wds: ComnWords,
    //
    isFull: (wd) => (Dicts.full.has(wd)),
    isComn: (wd) => (Dicts.comn.has(wd)),
    isValid: (wd) => ((Dicts.isComn(wd) || Dicts.isFull(wd))),
    lexMatches(lex, roundel) {
        const re = new RegExp(`^(?=.*${roundel.letters[0]})[${roundel.letters}]{4,}$`);
        // @ts-ignore
        const words = Dicts[`${lex}_wds`].filter((wd) => re.test(wd));
        const grouped = _.groupBy(words, 'length');
        const topScore = words.reduce((tot, wd) => {
            if (wd.length < 4) {
                return tot;
            }
            else if (wd.length === 4) {
                return tot + 1;
            }
            else if (roundel.pangRe.test(wd)) {
                return tot + wd.length + 7;
            }
            else {
                return tot + wd.length;
            }
        }, 0);
        const nums = {};
        _.range(4, 15).forEach((nn) => nums[nn] = (grouped[nn] || []).length); // eslint-disable-line
        //
        return { words, topScore, grouped, nums, num: words.length };
    }
};
// export default Dicts
export { FullWords, ComnWords, ObscWords, Dicts, };
//# sourceMappingURL=Dicts.js.map