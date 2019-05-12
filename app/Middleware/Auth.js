'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
// const

class Auth {
  async handle({ request, auth, response, view, session }, next) {
    let authenticator
    try {
      // Check login user as user
      authenticator = auth.authenticator('user')
      await authenticator.check()

      const user = await authenticator.getUser()
      await user.loadMany(['companies'])
      const companies = await user.getRelated('companies')
      request.role = 'user'

      if (
        user.complete_information == 'no' &&
        request.url() != '/dashboard/complete'
      ) {
        return response.redirect('/dashboard/complete')
      }
    } catch (error) {
      // Check login user as admin
      try {
        authenticator = auth.authenticator('admin')
        await authenticator.check()

        request.role = 'admin'
      } catch (error) {
        return response.redirect('/auth')
      }
    }

    // check loggined user status
    if (authenticator.user.status !== 'active') {
      await authenticator.logout()

      return response.redirect('/auth')
    }

    request.user = authenticator.user

    view.share({
      auth: {
        user: await authenticator.user,
      },
    })

    await next()
  }
}

module.exports = Auth
