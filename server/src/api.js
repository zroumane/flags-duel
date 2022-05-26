import express from 'express'
const router = express.Router()

import store from './store.js'

router.get('/', (req, res) => {
  res.json({ data: { message: 'Flags Duel API' } })
})

router.get('/duel', (req, res) => {
  res.json({ data: { count: store.size() } })
})

router.post('/duel', (req, res) => {
  let duel = store.new(req.session.id)
  res.json({ data: { id: duel.id } })
})

router.get('/duel/:id', (req, res) => {
  let duel = store.get(req.params.id)
  if (!duel) res.json({ data: 'notfound' })
  else return res.json({ data: duel.addPlayer(req.session.id) })
})

export default router
