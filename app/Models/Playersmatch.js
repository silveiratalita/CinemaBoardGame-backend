'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Playersmatch extends Model {
  static boot () {
    super.boot()
  }

  user () {
    return this.hasOne('App/Models/User')
  }

  match () {
    return this.hasOne('App/Models/Match')
  }
}

module.exports = Playersmatch
