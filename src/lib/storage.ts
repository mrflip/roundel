import _                           /**/ from 'lodash'
import * as TY          from './types.js'
import Roundel                          from './Roundel'

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

export function loadBag<T>(storageKey: string): T | undefined {
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

export function storeRoundel(roundel: TY.Roundel) {
  console.log('storeRoundel', roundel.serialize())
  storeBag(roundel.letters, roundel.serialize())
  console.log('see?', loadRoundel(roundel.letters))
}

export function loadRoundel(raw: string): Roundel {
  const letters = Roundel.normalize(raw)
  const bag = loadBag<Roundel>(letters)
  console.log('loadRoundel', letters, bag)
  return Roundel.from(bag ?? { letters })
}
