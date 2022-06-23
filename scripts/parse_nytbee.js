#!/usr/bin/env yarn node --experimental-specifier-resolution=node
import _                           /**/ from 'lodash'
import fs                               from 'fs'
import JSSoupLib                        from 'jssoup'
import glob                             from 'glob'
import moment                           from 'moment'
//
import Roundel                              from '../built/src/lib/Roundel'
import ArchDict                         from '../data/dict_arch.json' assert { type: 'json' }

// --- Setup
// ( cd /data/ripd; wget -r -l100000 --no-clobber -nv https://nytbee.com/Bee_`date +"%Y%m%d"`.html && cd ~- && ./scripts/parse_nytbee.js )
const data_dir = '/Users/Shared/data/ripd/nytbee.com'

const JSSoup = JSSoupLib.default

// --- Parse
const AllWords = new Set(ArchDict)
const AllObs   = new Set()
const AllRoundels  = []

const VOWELS   = new Set('a', 'e', 'i', 'o', 'u')

let latestRoundel = 20080800

// For all of the files we downloaded,
glob(`${data_dir}/Bee*.html`, (err, files) => {
  files.forEach((filename) => {
    // console.log('Parsing', filename)

    // Read in the file as text
    const raw_html = fs.readFileSync(filename, 'utf8')
    // Grab a JSSoup parser
    const doc = new JSSoup(raw_html)

    // Make the object we will populate
    const words = {}

    // Find all the divs with class 'answer-list'
    // We only want the first and the thirds, so destructure them out
    const [wds_els, obs_els_a, obs_els_b] = doc
      .findAll('div')
      .filter((div) => (
        (div.attrs.class === 'answer-list')
          || (div.attrs.id === 'answer-list')
      ))

    // Within the div for words,
    words.wds     = wds_els
      .findAll('li')
      .map((el) => (el.text))           // Dump the HTML as text
      .map((str) => (str.replace(/\s/g, '')))           // strip whitespace
      .filter((ss) => (ss.length > 0))  // reject empty strings
    // console.log(words.wds.filter((wd) => (wd.length > 11)))

    // .split(/\s+/)                     // Split on whitespace

    // Within the div for rejected words,
    if (obs_els_b) {
      words.obs = obs_els_b             // go through its elements
        .findAll('li')                  // to find all the <li> tags
        .map((li) => li.text)           // And pull out the raw text from them
    } else if (obs_els_a) {
      words.obs = obs_els_a                 // go through its elements
        .findAll('li')                  // to find all the <li> tags
        .map((li) => li.text)           // And pull out the raw text from them
    } else {
      words.obs     = []
    }

    // Grab the date from the filename
    words.datestr = filename.replace(/.*Bee_/, '').replace(/\.html/, '')

    if (Number(words.datestr) > latestRoundel) { latestRoundel = words.datestr }

    // The page is now parsed; rest of this is turning it into the object we want

    // add to lexicons
    words.wds.forEach((word) => AllWords.add(word))
    words.obs.forEach((word) => AllObs.add(word))

    // Find main letter
    const ltr_hist = {}
    words.wds.forEach(
      (word) => _.uniq(word.split('')).forEach(
        (ltr) => (ltr_hist[ltr] = 1 + (ltr_hist[ltr]||0)))) // eslint-disable-line

    const sorted_letters = Object
      .entries(ltr_hist)
      .sort(([wda, cta], [_b, ctb]) => {
        if (cta > ctb)          return -1
        if (cta < ctb)          return  1
        if (VOWELS.has(wda))    return 1
        return -1
      })
      .map(([ll, _x]) => ll)
      .join('')

    words.letters = Roundel.normalize(sorted_letters)

    console.log('Parsed', filename, words.letters, words.wds.length, words.obs.length)

    AllRoundels.push(words)
  })

  // Make the whole dictionary into the shapes we want

  const all_wds = Array.from(AllWords.values()).sort()
  const all_obs = Array.from(AllObs.values()).sort()
  // console.log(all_wds)

  const all_ltrs = AllRoundels.map((bb) => [bb.letters.toUpperCase(), bb.datestr])
  all_ltrs.sort(([_wa, da], [_wb, db]) => (da < db ? 1 : -1))

  const stats = {
    wordsUpdated:       moment().format('YYYYMMDD'),
    latestRoundel,
    wordsCount:         all_wds.length,
    comnRoundelsCount:       all_ltrs.length,
  }

  // Write to disk

  fs.writeFileSync('./data/dict_comn.json',  JSON.stringify(all_wds,  0, 2) + '\n', { encoding: 'utf8' })
  fs.writeFileSync('./data/dict_obs.json',   JSON.stringify(all_obs,  0, 2) + '\n', { encoding: 'utf8' })
  fs.writeFileSync('./data/roundels.json',   JSON.stringify(all_ltrs, 0, 2) + '\n', { encoding: 'utf8' })
  fs.writeFileSync('./data/comn_stats.json', JSON.stringify(stats,    0, 2) + '\n', { encoding: 'utf8' })

  // Report on success

  console.log(stats)

  // import Dicts from './dicts'
  // console.log(Dicts)
})
