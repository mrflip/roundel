import _                           /**/ from 'lodash'
import * as TY          from './types.js'
import Roundel                          from './Roundel'
import seedDnas                         from '../../data/roundels.json'

const RoundelsIndex: TY.RoundelsIndex = seedDnas

const ROUNDEL_INDEX_KEY = 'roundelIndex'

export function getLocalStorage(key: string): string | undefined {
  try {
    return localStorage[key];
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export function setLocalStorage(key: string, val: unknown): void {
  try {
    localStorage[key] = val;
  } catch (err) {
    console.error(err);
  }
}

export function storeBag(storageKey: string, bag: object) {
  setLocalStorage(storageKey, JSON.stringify(bag))
}

export function loadBagWithFallback<T>(storageKey: string, fallback: T): T {
  const rawJson  = getLocalStorage(storageKey)
  if (rawJson) {
    try {
      const  result = mergeLoaded<T>(JSON.parse(rawJson), fallback)
      return result
    } catch (err) {
      console.error('loadBag could not parse json', rawJson, fallback)
      return fallback
    }
  }
  return fallback
}

export function loadBag(storageKey: string): any | undefined {
  const rawJson  = getLocalStorage(storageKey)
  if (rawJson) {
    try {
      const  result = JSON.parse(rawJson)
      return result
    } catch (err) {
      console.error('loadBag could not parse json', rawJson)
      return undefined
    }
  }
  return undefined
}

function mergeLoaded<T>(parsed: Partial<T>, fallback: T): T {
  return _.pick(_.merge({}, fallback, parsed), _.keys(fallback)) as T
}

export function loadRoundels() {
  const loaded   = loadBag(ROUNDEL_INDEX_KEY) || {}
  _.merge(RoundelsIndex, loaded)
  return RoundelsIndex
}

export function storeRoundels(roundelsIndex: TY.RoundelsIndex) {
  storeBag(ROUNDEL_INDEX_KEY, roundelsIndex)
}

export function storeRoundel(roundel: TY.Roundel) {
  console.log('storeRoundel', roundel.letters, RoundelsIndex[roundel.letters.toUpperCase()], roundel.sketch)
  storeBag(roundel.letters, roundel.serialize())
  RoundelsIndex[roundel.letters.toUpperCase()] = roundel.sketch
  storeRoundels(RoundelsIndex)
}

export function loadRoundel(raw: Partial<Roundel>): Roundel {
  const letters = Roundel.normalize(raw.letters!)
  const loaded  = loadBag(letters)
  const bag = _.merge({}, loaded || {}, raw, { letters, stored: (!! loaded) })
  return bag as Roundel
}
