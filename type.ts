const STATE = ["CONFIG", "PLAYING", "FINISHED"]

type Duel = {
  id: string,
  state: string
  players: User[]
}

type Round = {
  flag: string
  choices: Country[]
}

type Country = {
  name: string
  id: number
  continent: string
  flag_base64: string
}

type User = {
  pseudo: string,
  id: string
}