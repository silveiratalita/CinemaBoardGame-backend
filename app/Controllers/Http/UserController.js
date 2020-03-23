'use strict'
const crypto = require('crypto')
const User = use('App/Models/User')
const Logger = use('Logger')
Logger.level = 'debug'
class UserController {
  async store ({ request }) {
    try {
      const data = request.only(['username', 'email', 'password'])
      data.hashkey = crypto.randomBytes(7).toString('hex')
      const user = await User.create(data)
      return user
    } catch (err) {
      console.log(err)
    }
  }

  async getUser ({ request, response }) {
    try {
      const { username, email } = request.all()
      const userFound = await User.findBy('email', email)
      if (!userFound) {
        return response.status(404).send('User not found')
      }
      // const userToReturn = {
      //   username: userFound.username,
      //   email: userFound.email,
      //   hashkey: userFound.hashkey
      // }
      return {
        username: userFound.username,
        email: userFound.email,
        hashkey: userFound.hashkey
      }
    } catch (err) {
      console.log(err)
      return ({ error: err.toString() })
    }
  }
}

module.exports = UserController
