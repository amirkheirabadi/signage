'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Monitor extends Model {
  static get table() {
    return 'montiros'
  }

  static get primaryKey() {
    return 'id'
  }
}

module.exports = Monitor
