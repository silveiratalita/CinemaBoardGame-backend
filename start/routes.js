'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.get('/users', 'UserController.getUser')
Route.post('/users', 'UserController.store')
Route.post('/sessions', 'SessionController.store')
Route.post('passwords', 'ForgotPasswordController.store')
Route.post('matches', 'MatchController.createMatch')
