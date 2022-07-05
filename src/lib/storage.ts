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

function delLocalStorage(key: string): void {
  try {
    delete localStorage[key]
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

export function storeRoundel(playerID: string, roundel: TY.Roundel, { writeIndex = true, updatePlayed = true } = {}) {
  storeBag(playerKey(playerID, roundel.letters), roundel.serialize({ updatePlayed }))
  RoundelsIndex[roundel.letters.toUpperCase()] = _.omit(roundel.sketch, ['up', 'updatedAt'])
  // console.log('storeRoundel', playerID, roundel.letters, RoundelsIndex[roundel.letters.toUpperCase()], roundel.serialize())
  if (writeIndex) { storeRoundels(RoundelsIndex) }
}

export function loadRoundel(playerID: string, raw: TY.RoundelFodder): Roundel {
  const letters = Roundel.normalize(raw.letters!)
  const loaded  = loadBag(playerKey(playerID, letters))
  const dna     = RoundelsIndex[letters.toUpperCase()]
  const bag     = _.merge({}, loaded || {}, raw, { ...dna, letters, stored: (!! loaded) })
  return bag as Roundel
}

export function loadGlobals(): TY.RoundelGlobals {
  return loadBagWithFallback('roundelGlobals', { playerIDs: [] })
}

export function storeGlobals(globals: TY.RoundelGlobals) {
  return storeBag('roundelGlobals', globals)
}

export function deleteAllRoundels(playerID: string) {
  console.log('deleteAllRoundels', playerID)
  _.each(RoundelsIndex, ({ ll }) => {
    delLocalStorage(playerKey(playerID, ll))
  })
}

export function exportRoundels(playerID: string): string {
  const played = []
  _.each(RoundelsIndex, ({ ll }) => {
    const loaded = loadBag(playerKey(playerID, ll.toLowerCase()))
    if (loaded) { played.push(loaded) }
  })
  return played
}

export function importRoundelsJson(playerID: string, json: string) {
  const roundels = JSON.parse(json)
  if (! (_.isArray(roundels) && _.every(roundels, 'letters'))) {
    const message = `roundels must be an array of { letters, datestr, gooduns, nogos } bags`
    throw new Error(message)
  }
  let [imported, skipped, same] = [0, 0, 0]
  for (const raw of roundels) {
    if (_.isEmpty(raw.gooduns) || (! Roundel.attemptable(raw.letters))) {
      skipped += 1
      continue
    }
    const loaded    = loadBag(playerKey(playerID, raw.letters.toLowerCase())) || {}
    const gooduns   = _.uniq([...(loaded.gooduns || []), ...raw.gooduns]).sort()
    const nogos     = _.uniq([...(loaded.nogos   || []), ...raw.nogos]).sort()
    // console.log(loaded, raw, gooduns, nogos)
    const updatedAt = _.max([raw.updatedAt, loaded.updatedAt])
    const roundel = Roundel.from({ ...raw, gooduns, nogos, updatedAt })
    storeRoundel(playerID, roundel, { writeIndex: false, updatePlayed: false })
    if (_.isEqual(gooduns, loaded.gooduns)) { same += 1 } else { imported += 1 }
  }
  storeRoundels(RoundelsIndex)
  return { imported, skipped, same }
}
