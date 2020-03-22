'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlayermatchesSchema extends Schema {
  up () {
    this.create('playermatches', table => {
      table.increments()
      table.timestamps()

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
      table
        .integer('match_id')
        .unsigned()
        .references('id')
        .inTable('matches')
    })
  }

  down () {
    this.drop('playermatches')
  }
}

module.exports = PlayermatchesSchema
