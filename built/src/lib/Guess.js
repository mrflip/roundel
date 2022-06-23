import _ from 'lodash';
import { Dicts } from './Dicts';
const Bowdlerizers = _.range(0, 15).map((len) => new RegExp(`^(.*?)(.{0,${len}})$`));
export class Guess {
    word;
    len;
    score;
    pang;
    full;
    comn;
    valid;
    hasMain;
    constructor(wd, roundel) {
        this.word = wd.toLowerCase();
        this.len = this.word.length;
        this.pang = roundel.isPang(this.word);
        this.full = Dicts.isFull(this.word);
        this.comn = Dicts.isComn(this.word);
        this.valid = (this.full || this.comn);
        this.hasMain = roundel.hasMain(this.word);
        this.score = this.getScore();
    }
    revealed(reveal) {
        if (!_.isNumber(reveal)) {
            return this.word;
        }
        const stars = _.padEnd('', (this.len - reveal), '*');
        if (reveal <= 0) {
            return stars;
        }
        const bowler = Bowdlerizers[reveal] || Bowdlerizers[15];
        return this.word.replace(bowler, (_m, hide, show) => (stars + show)); // eslint-disable-line
    }
    getScore() {
        if (this.nogo)
            return 0;
        if (!this.comn)
            return 0;
        if (this.len === 4)
            return 1;
        return this.len + (this.pang ? 7 : 0);
    }
    get nogo() {
        return ((!this.valid) || (!this.hasMain) || (this.len < 4));
    }
    get flavor() {
        if (!this.valid) {
            return 'bogon';
        }
        if (!this.hasMain) {
            return 'nomain';
        }
        if (this.len < 4) {
            return 'shorty';
        }
        if (this.pang) {
            return 'pang';
        }
        if (this.comn) {
            return 'comn';
        }
        return 'obsc';
    }
}
export default Guess;
//# sourceMappingURL=Guess.js.map