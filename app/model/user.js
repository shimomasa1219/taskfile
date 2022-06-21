const crypto = require('crypto')

module.exports = class User {
  constructor(login_id, password, name) {
    this.login_id = login_id
    this.password = password
    this.name = name
  }

  verifyPassword(password) {
    const hashedPass = crypto.createHash('sha256').update(password).digest('hex')
    return this.password === hashedPass
  }
}
