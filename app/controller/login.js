const crypto = require('crypto')
const User = require('../model/user')
const userRepository = require('../repository/user_repository')()

module.exports = function login(req, res) {
  const user_id = req.body.user_id
  const password = req.body.password

  const user = userRepository.find(user_id, (user) => {
    if (user && user.verifyPassword(password)) {
      res.render('top.ejs', { name: user.name })
    } else {
      res.render('login.ejs', {
        message: 'ユーザーIDまたはパスワードに誤りがあります。'
      })
    }  
  })
}
