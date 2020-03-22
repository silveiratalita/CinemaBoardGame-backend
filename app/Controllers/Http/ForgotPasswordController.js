'use strict'
const User = use('App/Models/User')
const crypto = require('crypto')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()
      const result = await user.save()
      await Mail.send(
        ['emails.forgot_password'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('talita@talita.com', 'Talita | Home')
            .subject('Password Recovery')
        }
      )
      return response.send({ message: `Token generated:${result}` })
    } catch (err) {
      console.log(err)
      return response
        .status(err.status)
        .send({ error: { message: 'Something went wrong, this e-mail really exists?' } })
    }
  }
}

module.exports = ForgotPasswordController
