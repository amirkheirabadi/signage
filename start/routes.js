'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  // Auth
  Route.any('/', 'authController.signin')
  Route.any('/signup', 'authController.signup')
  Route.get('/signout', 'authController.signout')

  Route.any('/verify/:email', 'authController.verification')

  // Social Auth
  Route.get('/social/:provider', 'authController.redirect')
  Route.get('/social/:provider/callback', 'authController.callback')
}).prefix('/auth')

Route.group(() => {
  Route.any('/monitors', 'monitorController.index')

  Route.any('/complete', 'dashboardController.complete')
  Route.get('/', 'dashboardController.index')
})
  .prefix('/dashboard')
  .middleware(['auth'])

Route.on('/').render('welcome')
