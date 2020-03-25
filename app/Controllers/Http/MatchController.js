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

      const allMatches = await Database.from('matches')
        .innerJoin('playermatches', 'matches.id', 'playermatches.match_id')
        .innerJoin('users', 'users.id', 'playermatches.user_id')
        .whereIn('matches.id', allIds)

      Logger.debug('alllllmatches---aquii', allMatches)

      let test
      for (const match in allMatches) {
        let obj = {
          players: []
        }
        for (const id in allMatches) {
          if (allMatches.hasOwnPropety(id) && id === match.id) {
            obj.players.push(match.username)
          }
        }
        obj = {
          idPartida: match.match_id,
          date: match.date,
          winner: match.winner,
          start_time: match.start_time,
          end_time: match.start_time,
          duration: match.start_time,
          number_of_players: match.number_of_players,
          number_of_rounds: match.number_of_rounds,
          room_name: match.room_name
        }
        test = obj
      }
      return response.send(test)
    } catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
}

module.exports = MatchController
