import countries from '../countries.json' assert { type: 'json' }

const category = ['Africa', 'America', 'Asia', 'Europe']

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

export default (config) => {
  let rounds = []
  let selection =
    config.category == 0
      ? countries
      : countries.filter((c) => c.continent == category[config.category - 1])

  for (let i = 0; i < config.round; i++) {
    let country = selection[Math.floor(Math.random() * selection.length)]
    if (rounds.find((r) => r.country == country)) {
      i--
      continue
    } else {
      let choices = [country]
      for (let o = 0; o < 3; o++) {
        let choice = selection[Math.floor(Math.random() * selection.length)]
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
