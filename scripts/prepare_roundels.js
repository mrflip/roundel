#!/usr/bin/env yarn node --experimental-specifier-resolution=node
import _                           /**/ from 'lodash'
import fs                               from 'fs'
import moment                           from 'moment'
//
import Roundel                          from '../built/src/lib/Roundel'
import RoundelDnas                      from '../rawd/roundel_dnas.json' assert { type: 'json' }
import OtherDnas                        from '../rawd/all_import-20220620.l.json' assert { type: 'json' }
OtherDnas.shift()

const AllRoundels = _.mapValues(RoundelDnas, (raw) => Roundel.from(raw))

_.each(OtherDnas, (dna) => {
  const { letters, datestr } = dna
  AllRoundels[letters] ||= Roundel.from(dna)
})

const AllSketches = _.mapValues(AllRoundels, (roundel) => _.omit(roundel.sketch, ['up']))

fs.writeFileSync('./data/roundels.json', JSON.stringify(AllSketches, 0, 2) + '\n', { encoding: 'utf8' })
