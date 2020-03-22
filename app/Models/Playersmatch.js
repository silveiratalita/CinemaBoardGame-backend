'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Playersmatch extends Model {
  static boot () {
    super.boot()
  }

  user () {
    return this.hasMany('App/Models/User')
  }

  match () {
    return this.hasMany('App/Models/Match')
  }
}

module.exports = Playersmatch
