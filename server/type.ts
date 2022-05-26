const STATE = ['CONFIG', 'PLAYING', 'FINISHED']

type Duel = {
  state: 'CONFIG' | 'PLAYING' | 'FINISHED'
  players: User[]
  round: Round[]
  config: {
    category: string
    round: number
  }
}

type Round = {
  country: Country
  choices: Country[]
}

type Country = {
  id: number
  name: string
  continent: string
  flag: string
}

type User = {
  id: string
  point: number
}
