'use strict'

const Company = use('App/Models/Company')
const { validate } = use('Validator')
const hash = use('Hash')

class DashboardController {
  async index({ request, response, view }) {
    return view.render('dashboard.index', {
      title: 'dashboard',
    })
  }

  async completeInfo({ request, response, view }) {
    if (request.method() == 'GET') {
      return view.render('dashboard.complete')
    }

    const validation = await validate(request.all(), {
      first_name: 'required',
      last_name: 'required',
      mobile: 'required',
      country: 'required',

      company_name: 'required',
      company_employess: 'required',
      company_category: 'required',
    })

    if (validation.fails()) {
      session.flash({
        errors: Message.normalizeMessages(validation.messages()),
      })
      return response.redirect('back')
    }

    request.user.first_name = request.input('first_name')
    request.user.last_name = request.input('last_name')
    request.user.mobile = request.input('mobile')
    // request.user.country = request.input('country')
    await request.user.save()

    const company = new Company()
    company.name = request.input('company_name')
    await company.save()

    return request.all()
  }

  async profile({ request, response }) {
    if (request.method() == 'GET') {
      return view.render('dashboard.profile', {
        title: 'profile',
        user: request.user,
      })
    }

    const validation = await validate(request.all(), {
      first_name: 'required',
      last_name: 'required',
      mobile: 'required',
      country: 'required',
      password: 'confirmed',
    })

    request.user.first_name = request.input('first_name')
    request.user.last_name = request.input('last_name')
    request.user.mobile = request.input('mobile')
    // request.user.country = request.input('country')

    if (request.input('password')) {
      request.user.password = Hash.make(request.input('passsword'))
    }

    await request.user.save()

    return response.redirect('/dashboard/profile')
  }
}

module.exports = DashboardController
