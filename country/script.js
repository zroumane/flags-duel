import fetch from 'node-fetch'
import {writeFileSync} from 'fs'


let continents = {'World': [],'Africa': [], 'Americas': [], 'Asia': [], 'Europe': []}
let countries = []
let flags = new Map()
let n = 0

for (const continent in continents) {
  if(continent == 'World') continue
  continents[continent].push(n)
  let response = await fetch(`https://restcountries.com/v2/region/${continent}?fields=alpha2Code,name,flag`)
  let data = await response.json()
  for (const c of data) {
    response = await fetch(c.flag)
    flags.set(c.alpha2Code, await response.text())
    countries.push({name: c.name, code: c.alpha2Code})
  }
  n += data.length 
  continents[continent].push(n - 1)
}

continents['World'] = [0, n]

writeFileSync("./server/continents.json", JSON.stringify(continents))
writeFileSync("./server/countries.json", JSON.stringify(countries))
writeFileSync("./server/flags.json", JSON.stringify(Object.fromEntries(flags)))