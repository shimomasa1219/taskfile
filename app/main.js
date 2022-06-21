const express = require('express')
const bodyParser = require('body-parser')
const login = require('./controller/login')
const download = require('./controller/download')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/login_form', (req, res) => {
  res.render('login.ejs', { message: '' })
})

app.get('/', (req, res) => {
  res.redirect('/login_form')
})

app.post('/login', login)

app.get('/download', download)

app.listen(8080, (err) => {
  if (err) throw err
  console.log('Server is started')
})
