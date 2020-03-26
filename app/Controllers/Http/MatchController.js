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

      const matchesOfPlayer = await PlayerMatches.all({ user_id: userId })
      Logger.debug('matches aqui=>', matchesOfPlayer)

      const allIds = matchesOfPlayer.rows.map(match => match.id)
      var array = Array.from(allIds.keys())
      Logger.debug('array', array)
      for (const [key, value] of allIds.entries()) {
        Logger.debug('value', value)
        // const a = await PlayerMatches.findByOrFail()
      }

      return response.send()
    } catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
}

module.exports = MatchController
