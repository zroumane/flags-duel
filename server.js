const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors')
const history = require('connect-history-api-fallback');

const app = express();
app.use(cookieParser());
app.use(session({
  secret: "secreat", 
  saveUninitialized: true, 
  resave: false}));
app.use(cors({credentials: true, origin: '*'}));

if (process.env.NODE_ENV != "development") {
  console.log("Prod : serving static files")
  app.use(history());
  app.use('/', express.static(path.join(__dirname, 'dist')));
}

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
  duels.set(id, {
    state: "CONFIG",
    config: {},
    players: {},
    round: {}
  })
  console.log(duels);
  res.json({data:{id: id}});
})

app.get('/api/duel/:id', function (req, res) {
  console.log(req.session.id);
  let duel = duels.get(req.params.id)
  if(!duel) {
    res.status(404).send("No Duel")
  }else{
    res.send({data: duel})
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})