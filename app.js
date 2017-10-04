const express = require('express')
const app = express()
const template = require('./template')
const users = require('./db/users.json')
const posts = require('./db/posts.json')
global.moment = require('moment')
require('stjs')

// users only
app.get('/users', function (req, res) {
  res.json(users)
})
// posts only
app.get('/posts', function (req, res) {
  res.json(posts)
})
// combined
app.get('/', function (req, res) {
  var json = JSON.select({ users: users, posts: posts })
                  .inject(['moment'])
                  .transformWith(template)
                  .root()
  res.json(json)
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
