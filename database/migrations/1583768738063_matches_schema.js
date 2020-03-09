'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MatchesSchema extends Schema {
  up () {
    this.create('matches', (table) => {
      table.increments()
      table.datetime('date').notNullable()
      table.timestamps()
      table.string('winner')
      table.timestamp('start_time')
      table.timestamp('end_time')
      table.timestamp('duration')
      table.string('number_of_players')
      table.string('number_of_rounds').notNullable()
      table.string('room_name').notNullable()
    })
  }

  down () {
    this.drop('matches')
  }
}

module.exports = MatchesSchema
