'use strict'

const company = use('App/Models/Company')

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

    user.first_name = request.input('first_name')
    user.last_name = request.input('last_name')
    user.mobile = request.input('mobile')
    user.country = request.input('country')
    await user.save()

    const company = new Company()
    company.name = request.input('company_name')
    await company.save()

    return request.all()
  }
}

module.exports = DashboardController
