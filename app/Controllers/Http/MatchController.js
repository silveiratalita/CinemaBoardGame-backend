'use strict'
const Match = use('App/Models/Match')
const User = use('App/Models/User')
const PlayerMatches = use('App/Models/PlayerMatches')

const Logger = use('Logger')
Logger.level = 'debug'

class MatchController {
  async createMatch ({ request, response }) {
    try {
      const { userEmail, roomName, rounds } = request.all()
      const date = new Date()
      const userExist = await User.findByOrFail('email', userEmail)
      if (!userExist) {
        return response
          .status(404)
          .send('User Not Found')
      }

      Logger.debug('MatchControler:userExist $j', userExist)

      const matchCreated = await Match.create({ room_name: roomName, number_of_rounds: rounds, date: date })

      Logger.debug('MatchControler:matchCreated $j', matchCreated)

      const playerAndMatch = await PlayerMatches.create({ user_id: userExist.id, match_id: matchCreated.id })

      Logger.debug('MatchControler:playerAndMatch $j', playerAndMatch)

      return (matchCreated)
    } catch (err) {
      console.log(err)
      return err
    }
  }

  async calculateTime (rounds, players) {
    return ((players * 3) * rounds)
  }
}

module.exports = MatchController
