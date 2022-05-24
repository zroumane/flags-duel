const path = require('path');
const express = require('express');
const cors = require('cors')

const app = express();

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'dist')));

let duels = new Map()

const uniqueId = () => {
  const id = Array.from({length: 5}, () => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')[Math.floor(Math.random() * 36)]
  }).join('')

  if (duels.has(id)) {
    return uniqueId()
  }
  else {
    return id
  }

}

app.get('/api/', function (req, res) {
  res.json({data: {message : 'Flags Duel API'}});
})

app.get('/api/duel', function (req, res) {
  res.json({data: {count : duels.size}});
})

app.post('/api/duel', function (req, res) {
  let id = uniqueId()
  duels.set(id, {})
  console.log(duels);
  res.json({data:{id: id}});
})

app.get('/api/duel/:id', function (req, res) {
  // res.json({data:{id: "ouioui"}});
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})