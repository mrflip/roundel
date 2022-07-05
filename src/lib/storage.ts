import _                           /**/ from 'lodash'
import * as TY          from './types.js'
import Roundel                          from './Roundel'
import seedDnas                         from '../../data/roundels.json'

const RoundelsIndex: TY.RoundelsIndex = seedDnas

const ROUNDEL_INDEX_KEY = 'roundelIndex'

function getLocalStorage(key: string): string | undefined {
  try {
    return localStorage[key];
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

function setLocalStorage(key: string, val: unknown): void {
  try {
    localStorage[key] = val;
  } catch (err) {
    console.error(err);
  }
}

function playerKey(playerID: string, baseKey: string) {
  return [playerID.toLowerCase().replaceAll(/\W+/g, ''), baseKey].join('_')
}

export function storeBag(storageKey: string, bag: object) {
  const contents = JSON.stringify(bag)
  console.log('stored', storageKey, contents.length / 1e3, 'kChars')
  setLocalStorage(storageKey, contents)
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

function mergeLoaded<T>(parsed: Partial<T>, fallback: T): T {
  return _.pick(_.merge({}, fallback, parsed), _.keys(fallback)) as T
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

export function loadRoundels() {
  const loaded   = loadBag(ROUNDEL_INDEX_KEY) || {}
  _.merge(RoundelsIndex, loaded)
  return RoundelsIndex
}

export function storeRoundels(roundelsIndex: TY.RoundelsIndex) {
  storeBag(ROUNDEL_INDEX_KEY, roundelsIndex)
}

export function loadPrefs(playerID: string) {
  return loadBagWithFallback(playerKey(playerID, 'roundelPrefs'), { sortAxis: 'date', search: '' })
}

export function storePrefs(playerID: string, prefs: TY.RoundelPrefs) {
  console.log('storePrefs', prefs)
  storeBag(playerKey(playerID, 'roundelPrefs'), prefs)
}

export function storeRoundel(playerID: string, roundel: TY.Roundel) {
  storeBag(playerKey(playerID, roundel.letters), roundel.serialize())
  RoundelsIndex[roundel.letters.toUpperCase()] = roundel.sketch
  console.log('storeRoundel', playerID, roundel.letters, RoundelsIndex[roundel.letters.toUpperCase()], roundel.serialize())
  storeRoundels(RoundelsIndex)
}

export function loadRoundel(playerID: string, raw: TY.RoundelFodder): Roundel {
  const letters = Roundel.normalize(raw.letters!)
  const loaded  = loadBag(playerKey(playerID, letters))
  const dna     = RoundelsIndex[letters.toUpperCase()]
  const bag = _.merge({}, loaded || {}, raw, { ...dna, letters, stored: (!! loaded) })
  return bag as Roundel
}

export function loadGlobals(): TY.RoundelGlobals {
  return loadBagWithFallback('roundelGlobals', { playerIDs: [] })
}

export function storeGlobals(globals: TY.RoundelGlobals) {
  return storeBag('roundelGlobals', globals)
}
