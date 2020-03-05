'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.get('/', () => 'Hello Cinema!')
Route.post('/users', 'UserController.store')
Route.post('/sessions', 'SessionController.store')
