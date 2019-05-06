'use strict'

class MonitorController {
  async index({ request, response, view }) {
    if (request.method() == 'GET') {
      return view.render('monitors.index', {
        title: 'monitor management',
      })
    }
  }
}

module.exports = MonitorController
