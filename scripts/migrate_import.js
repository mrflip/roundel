#!/usr/bin/env yarn node --experimental-specifier-resolution=node
import _                           /**/ from 'lodash'
import fs                               from 'fs'
import moment                           from 'moment'
//
import Roundel                          from '../built/src/lib/Roundel'
import OtherDnas                        from '../rawd/all_import-20220620.l.json' assert { type: 'json' }
import RoundelDnas                      from '../rawd/roundel_dnas.json' assert { type: 'json' }
OtherDnas.shift()

const AllRoundels = {}

_.each(OtherDnas, (dna) => {
  if (_.isEmpty(dna.guesses)) { return }
  dna.gooduns = dna.guesses
  const roundel = Roundel.from({ ...dna, ol: false, ...RoundelDnas[dna.letters.toUpperCase()] })
  AllRoundels[dna.letters] = roundel
})

const Serialized = _.map(AllRoundels, (rr) => rr.serialize())

console.log(Serialized.length, Serialized.slice(-30, -1))

// const TODAY = moment().format('YYYYMMDD')
// _.each(AllSketches, (sketch) => { if (sketch.up === TODAY) { delete sketch.up } })

fs.writeFileSync(
  './rawd/backup-20220620.json',
  JSON.stringify(Serialized, 0, 2) + '\n',
  { encoding: 'utf8' },
)
