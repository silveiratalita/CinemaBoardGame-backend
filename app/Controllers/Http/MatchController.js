'use strict'
const Match = use('App/Models/Match')
const User = use('App/Models/User')
const PlayersMatch = use('App/Models/PlayersMatch')
class MatchController {
  async createMatch ({ request, response }) {
    try {
      const { userHashkey, roomName, rounds } = request.all()
      const date = new Date()
      const userExist = await User.findByOrFail('hashkey', userHashkey)
      if (!userExist) {
        return response
          .status(404)
          .send('User Not Found')
      }
      const matchCreated = Match.create({ room_name: roomName, number_of_rounds: rounds, date: date })
      const playerAndMatch = PlayersMatch.create({ user_id: userExist.id, match_id: matchCreated.id })
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
