'use strict'

const { validate } = use('Validator')
const Message = use('App/Utils/Message')
const Hash = use('Hash')
const randomstring = require('randomstring')

const User = use('App/Models/User')
const Verify = use('App/Models/Verify')

class AuthController {
  async redirect({ ally, params }) {
    await ally.driver(params.provider).redirect()
  }

  async callback({ ally, auth, params }) {
    try {
      const fbUser = await ally.driver(params.provider).getUser()

      const userDetails = {
        email: fbUser.getEmail(),
        token: fbUser.getAccessToken(),
        login_source: params.provider,
      }

      const whereClause = {
        email: fbUser.getEmail(),
      }

      const user = await User.findOrCreate(whereClause, userDetails)
      await auth.login(user)

      return 'Logged in'
    } catch (error) {
      return 'Unable to authenticate. Try again later'
    }
  }

  // Auth
  async signin({ request, response, view, session, auth }) {
    if (request.method() == 'GET') {
      return view.render('auth.signin', {
        title: 'Signin',
      })
    }

    const validation = await validate(request.all(), {
      email: 'required|email',
      password: 'required',
    })

    if (validation.fails()) {
      session.flash({
        errors: Message.normalizeMessages(validation.messages()),
      })
      return response.redirect('/auth')
    }
    try {
      // check login as user
      await auth
        .authenticator('user')
        .attempt(request.input('email'), request.input('password'))
    } catch (error) {
      try {
        // check login as Admin
        await auth
          .authenticator('admin')
          .attempt(request.input('email'), request.input('password'))
      } catch (error) {
        session
          .flash({
            errors: ['Email or Password is wrong !'],
          })
          .flashExcept(['password'])
        return response.redirect('back')
      }
    }

    return response.redirect('/dashboard')
  }

  async signup({ request, response, view, session }) {
    if (request.method() == 'GET') {
      return view.render('auth.signup', {
        title: 'Signup',
      })
    }

    const validation = await validate(request.all(), {
      email: 'required|email|unique:users,email',
      password: 'required|confirmed',
    })

    if (validation.fails()) {
      session.flash({
        errors: Message.normalizeMessages(validation.messages()),
      })
      return response.redirect('/auth/signup')
    }

    let verify = await Verify.query()
      .where('email', request.input('email'))
      .first()
    if (!verify) {
      verify = new Verify()
      verify.email = request.input('email')
    }
    verify.email = request.input('email')
    verify.password = await Hash.make(request.input('password'))

    let crandomCode = randomstring.generate({
      length: 6,
      charset: 'numeric',
    })
    verify.code = crandomCode
    verify.save()

    return response.redirect('/auth/verify/' + verify.email)
  }

  async verification({ request, response, params, view, session, auth }) {
    const verify = await Verify.query()
      .where('email', params.email)
      .first()
    if (!verify) {
      return response.redirect('/auth')
    }

    if (request.method() == 'GET') {
      return view.render('auth.verify', {
        verify,
      })
    }

    const validation = await validate(request.all(), {
      code: 'required',
    })

    if (validation.fails()) {
      session.flash({
        errors: Message.normalizeMessages(validation.messages()),
      })
      return response.redirect('back')
    }

    if (request.input('code') !== verify.code) {
      session.flash({
        errors: ['code is wrong !'],
      })

      return response.redirect('back')
    }

    const user = new User()
    user.email = verify.email
    user.password = verify.password
    user.status = 'active'
    await user.save()

    await auth.login(user)
    await verify.delete()

    return response.redirect('/dashboard')
  }

  async signout({ request, response, auth, session }) {
    await auth.authenticator('admin').logout()
    await auth.authenticator('user').logout()

    response.redirect('/auth')
  }
}

module.exports = AuthController
