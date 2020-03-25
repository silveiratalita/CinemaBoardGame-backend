'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Match extends Model {
  static boot () {
    super.boot()
  }

  playermatches () {
    return this.belongsToMany('App/Model/Playermatche')
  }
}

module.exports = Match
