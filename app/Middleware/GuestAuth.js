'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class GuestAuth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, auth }, next) {
    let authenticator
    try {
      // Check login user as user
      authenticator = auth.authenticator('user')
      await authenticator.check()
      if (request.url() != '/auth/signout') {
        return response.redirect('/dashboard')
      }
    } catch (error) {
      // Check login user as admin
      try {
        authenticator = auth.authenticator('admin')
        await authenticator.check()

        if (request.url() != '/auth/signout') {
          return response.redirect('/dashboard')
        }
      } catch (error) {}
    }
    await next()
  }
}

module.exports = GuestAuth
