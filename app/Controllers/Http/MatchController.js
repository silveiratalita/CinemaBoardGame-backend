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
      const matches = await Database.raw(
        `select
	u2.username, m."date", m.room_name, m.winner, m.id as "match_id"
from
	users u2
inner join playermatches p2 on
	(u2.id = p2.user_id)
inner join matches m on
	(p2.match_id = m.id)
where
	match_id in (
	select
		m.id
	from
		users u2
	inner join playermatches p2 on
		(u2.id = p2.user_id)
	inner join matches m on
		(p2.match_id = m.id)
	where
		u2.id = ${userId}order by m.id	)`
      )
      const obj = { players: [] }
      matches.rows.map(e => {
        matches.rows.map(el => {
          if (e.match_id === el.match_id) {
            obj.players.push(e)
          } else {
            Logger.debug('XAU')
          }
        })
      })

      // entrar em cada posição
      // verificar o match_id
      // formar cada objeto match, com os jogadores, data nome da sala e vencedor.

      return response.send(obj)
    } catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
}

module.exports = MatchController
