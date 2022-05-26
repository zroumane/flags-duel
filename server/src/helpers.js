import store from './store.js'

const uniqueId = () => {
  const id = Array.from({ length: 5 }, () => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')[
      Math.floor(Math.random() * 36)
    ]
  }).join('')

  if (store.has(id)) return uniqueId()
  else return id
}

export { uniqueId }
