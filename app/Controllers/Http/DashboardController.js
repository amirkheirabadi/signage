'use strict'

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
  }
}

module.exports = DashboardController
