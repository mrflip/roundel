import _ /**/ from 'lodash';
import Roundel from './Roundel';
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
export function storeRoundel(roundel) {
    console.log('storeRoundel', roundel.serialize());
    storeBag(roundel.letters, roundel.serialize());
    console.log('see?', loadRoundel(roundel.letters));
}
export function loadRoundel(raw) {
    const letters = Roundel.normalize(raw);
    const bag = loadBag(letters);
    console.log('loadRoundel', letters, bag);
    return Roundel.from(bag ?? { letters });
}
//# sourceMappingURL=storage.js.map