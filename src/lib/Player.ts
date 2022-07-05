import _                           /**/ from 'lodash'

export class Player {
  id:           string
  key:          string

  constructor(playerID: string) {
    if (! Player.validID(playerID)) { throw new Error(`Player ID ${playerID} is too short or has funny characters`) }
    this.id  = playerID
    this.key = playerID.toLowerCase()
  }

  matchesID(str: string) { return (this.key === Player.keyifyID(str)) }

  static validID(str: string) {
    return (str && (str.length > 3) && /^\w+$/.test(str))
  }
  static normID(str: string) {
    return (str || '').replaceAll(/\W+/g, '')
  }
  static keyifyID(str: string) {
    return str.toLowerCase()
  }
}

export default Player
