const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const config = require('./server/config/main')
const passport = require('./server/config/passport')
const authRoutes = require('./server/routes/auth_routes')
const dbRoutes = require('./server/routes/db_routes')

// create new server
const server = express()

// configure server
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(session({
  secret: process.env.SESSION_SECRET || config.secret,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: process.env.MONGO_URL || config.database
  })
}))
server.use(express.static('public'))
server.use(passport.initialize())
server.use(passport.session())
server.use('/api', authRoutes)
server.use('/api', dbRoutes)
server.use(serveStatic(__dirname))

// server.get('/', (req, res) => {
//   res.send('hey there')
// })

// Start the server
server.listen(config.port, () => {
  console.log(`The API is listening on port ${config.port}`)
})
