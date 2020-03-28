'use strict'
const Match = use('App/Models/Match')
const User = use('App/Models/User')
const PlayerMatches = use('App/Models/PlayerMatches')
const Database = use('Database')

const Logger = use('Logger')
Logger.level = 'debug'

class MatchController {
  async createMatch ({ request, response }) {
    try {
      const { userEmail, roomName, rounds } = request.all()
      const date = new Date()
      const userExist = await User.findByOrFail('email', userEmail)
      if (!userExist) {
        return response.status(404).send('User Not Found')
      }

      Logger.debug('MatchControler:userExist $j', userExist)

      const matchCreated = await Match.create({
        room_name: roomName,
        number_of_rounds: rounds,
        date: date
      })

      Logger.debug('MatchControler:matchCreated $j', matchCreated)

      const playerAndMatch = await PlayerMatches.create({
        user_id: userExist.id,
        match_id: matchCreated.id
      })

      Logger.debug('PLAYERRRRRR=========E MATCHHH', playerAndMatch)

      return matchCreated
    } catch (err) {
      console.log(err)
      return err
    }
  }

  async getMatches ({ request, response }) {
    try {
      const { userId } = request.all()
      const matchesResult = await Database.raw(`select m.id, m."date", m.winner from users u2 inner join playermatches p2 on (u2.id = p2.user_id) inner join matches m on (p2.match_id = m.id) where u2.id = ${userId}`)



      for (let i = 0; i < Object.keys(matchesResult.rows).length; i++) {
        const m = Object.values(matchesResult.rows[i])
        Logger.debug(m.id)
        const players = this.getPlayersOfTheMatch(m.id)
        Logger.debug(players)
      }

      return response.send(matchesResult.rows)
    } catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

  async getPlayersOfTheMatch (matchID) {
    const playersOfTheMatchResult = []
    const playersQuery = `select
                         u2.username
                       from
                         users u2
                       inner join playermatches p2 on
                         (u2.id = p2.user_id)
                       where
                         p2.match_id = ${matchID}`

    const playersResult = await Database.raw(playersQuery)

    for (let j = 0; j < Object.keys(playersResult.rows).length; j++) {
      playersOfTheMatchResult[j] = Object.values(playersResult.rows[j])
    }

    return playersOfTheMatchResult
  }
}

module.exports = MatchController
