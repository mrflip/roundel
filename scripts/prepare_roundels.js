#!/usr/bin/env yarn node --experimental-specifier-resolution=node
import _                           /**/ from 'lodash'
import fs                               from 'fs'
//
import Roundel                          from '../built/src/lib/Roundel'
import RoundelDnas                      from '../data/roundel_dnas.json' assert { type: 'json' }
import OtherDnas                        from '../data/all_import-20220620.l.json' assert { type: 'json' }
OtherDnas.shift()

const AllRoundels = _.mapValues(RoundelDnas, (raw) => Roundel.from(raw))

_.each(OtherDnas, ({ letters, datestr }) => { AllRoundels[letters] ||= Roundel.from({ letters, datestr, ol: false }) })

// console.log(_.map(AllRoundels, 'letters').slice(-30, -1))

const AllSketches = _.mapValues(AllRoundels, (roundel) => _.omit(roundel.sketch, ['up']))

fs.writeFileSync('./data/roundels.json', JSON.stringify(AllSketches, 0, 2) + '\n', { encoding: 'utf8' })
