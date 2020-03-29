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

  async getMatches ({ params, request, response }) {
    try {
      const userId = params.userId
      // busca os jogos do jogador
      const matchesResult =
        await Database
          .from('users')
          .innerJoin('playermatches', 'playermatches.user_id', 'users.id')
          .innerJoin('matches', 'matches.id', 'playermatches.match_id')
          .where('users.id', userId)
          .select('matches.id', 'matches.date', 'matches.winner', 'room_name', 'number_of_rounds')

      // busca os jogadores de cada jogo e insere no objeto para retorno
      for (let i = 0; i < matchesResult.length; i++) {
        const m = matchesResult[i].id
        const players = await Database
          .select('users.id', 'users.username', 'users.email')
          .from('users')
          .innerJoin('playermatches', 'users.id', 'playermatches.user_id')
          .where('playermatches.match_id', m)
        // insere no objeto para retorno
        matchesResult[i].players = players
      }

      return response.send(matchesResult)
    } catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
}

module.exports = MatchController
