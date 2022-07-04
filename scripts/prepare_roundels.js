#!/usr/bin/env yarn node --experimental-specifier-resolution=node
import _                           /**/ from 'lodash'
import fs                               from 'fs'
import moment                           from 'moment'
//
import Roundel                          from '../built/src/lib/Roundel'
import RoundelDnas                      from '../data/roundel_dnas.json' assert { type: 'json' }
import OtherDnas                        from '../data/all_import-20220620.l.json' assert { type: 'json' }
OtherDnas.shift()

const AllRoundels = _.mapValues(RoundelDnas, (raw) => Roundel.from(raw))

_.each(OtherDnas, (dna) => {
  // dna.gooduns = dna.guesses
  // AllRoundels[dna.letters] = Roundel.from({ ...dna, ol: false, ...AllRoundels[dna.letters] })
  const { letters, datestr } = dna
  AllRoundels[letters] ||= Roundel.from(dna)
  // console.log(dna, { ...dna, ol: false, ...AllRoundels[dna.letters] }, AllRoundels[dna.letters])
})

// console.log(_.map(AllRoundels, 'letters').slice(-30, -1))

const AllSketches = _.mapValues(AllRoundels, (roundel) => roundel.sketch)

// const TODAY = moment().format('YYYYMMDD')
// _.each(AllSketches, (sketch) => { if (sketch.up === TODAY) { delete sketch.up } })

fs.writeFileSync('./src/data/roundels.json', JSON.stringify(AllSketches, 0, 2) + '\n', { encoding: 'utf8' })
