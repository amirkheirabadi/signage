'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Verify extends Model {
  static get table() {
    return 'verifications'
  }

  static get primaryKey() {
    return 'id'
  }
}

module.exports = Verify
