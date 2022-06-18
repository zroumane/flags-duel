import continents from '../continents.json' assert { type: 'json' }
import countries from '../countries.json' assert { type: 'json' }

const mapping = Object.values(continents)

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

const random = ([min, max]) => Math.floor(Math.random() * (max - min + 1) + min)

export default (config) => {
  let rounds = []
  for (let i = 0; i < config.round; i++) {
    let country = countries[random(mapping[config.category])]
    if (rounds.find((r) => r.country == country)) {
      i--
      continue
    } else {
      let choices = [country]
      for (let o = 0; o < 3; o++) {
        let choice = countries[random(mapping[config.category])]
        if (choices.includes(choice) || country == choice) {
          o--
          continue
        } else {
          choices.push(choice)
        }
      }
      shuffle(choices)
      rounds.push({ country, choices })
    }
  }
  return rounds
}
