require('dotenv').config({ path: './.env' })

const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()
app.use(express.json())

app.use(cors())

app.use((req, res, next) => {
  res.set('cache-Control', 'no-store')
  next()
})

const Auth = require('./routes/auth/Auth')
const User = require('./routes/user/User')
const Industry = require('./routes/industry/route')
const State = require('./routes/state/route')
const Licence = require('./routes/licence/route')
const MusicLabel = require('./routes/musiclabel/route')
const City = require('./routes/city/route')
const Organization = require('./routes/organization/route')
const Brand = require('./routes/brand/route')
const BrandZone = require('./routes/brandzone/route')
const Store = require('./routes/store/route')
const Role = require('./routes/role/route')
const Media = require('./routes/media/route')
const File = require('./routes/file/route')
const Playlist = require('./routes/playlist/route')


app.use('/static',express.static('public'));

// connect to mongo db
mongoose
  .connect(`mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('mongo connected'))
  .catch((err) => console.log(err))

app.use('/api/auth', Auth)
app.use('/api/user', User)
app.use('/api/media', Media)
app.use('/api/industry', Industry)
app.use('/api/state', State)
app.use('/api/licence', Licence)
app.use('/api/musiclabel', MusicLabel)
app.use('/api/city', City)
app.use('/api/organization', Organization)
app.use('/api/brand', Brand)
app.use('/api/brandZone', BrandZone)
app.use('/api/store', Store)
app.use('/api/role', Role)
app.use('/api/file', File)
app.use('/api/media', Media)
app.use('/api/playlist', Playlist)

// app.get('/', (req, res) => {
//   res.send('sadasdasdsad')
// })
const port = process.env.SERVER_PORT || 8002

app.listen(port, () => console.log(`Server started on port ${port}`))
