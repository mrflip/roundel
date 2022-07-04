import _ /**/ from 'lodash';
import Roundel from './Roundel';
import seedDnas from '../../data/roundels.json';
const RoundelsIndex = seedDnas;
const ROUNDEL_INDEX_KEY = 'roundelIndex';
export function getLocalStorage(key) {
    try {
        return localStorage[key];
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
}
export function setLocalStorage(key, val) {
    try {
        localStorage[key] = val;
    }
    catch (err) {
        console.error(err);
    }
}
export function storeBag(storageKey, bag) {
    setLocalStorage(storageKey, JSON.stringify(bag));
}
export function loadBagWithFallback(storageKey, fallback) {
    const rawJson = getLocalStorage(storageKey);
    if (rawJson) {
        try {
            const result = mergeLoaded(JSON.parse(rawJson), fallback);
            return result;
        }
        catch (err) {
            console.error('loadBag could not parse json', rawJson, fallback);
            return fallback;
        }
    }
    return fallback;
}
export function loadBag(storageKey) {
    const rawJson = getLocalStorage(storageKey);
    if (rawJson) {
        try {
            const result = JSON.parse(rawJson);
            return result;
        }
        catch (err) {
            console.error('loadBag could not parse json', rawJson);
            return undefined;
        }
    }
    return undefined;
}
function mergeLoaded(parsed, fallback) {
    return _.pick(_.merge({}, fallback, parsed), _.keys(fallback));
}
export function loadRoundels() {
    const loaded = loadBag(ROUNDEL_INDEX_KEY) || {};
    _.merge(RoundelsIndex, loaded);
    return RoundelsIndex;
}
export function storeRoundels(roundelsIndex) {
    storeBag(ROUNDEL_INDEX_KEY, roundelsIndex);
}
export function storeRoundel(roundel) {
    console.log('storeRoundel', roundel.letters, RoundelsIndex[roundel.letters.toUpperCase()], roundel.sketch);
    storeBag(roundel.letters, roundel.serialize());
    RoundelsIndex[roundel.letters.toUpperCase()] = roundel.sketch;
    storeRoundels(RoundelsIndex);
}
export function loadRoundel(raw) {
    const letters = Roundel.normalize(raw.letters);
    const loaded = loadBag(letters);
    const bag = _.merge({}, loaded || {}, raw, { letters, stored: (!!loaded) });
    return bag;
}
//# sourceMappingURL=storage.js.map