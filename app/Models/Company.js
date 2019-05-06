'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Company extends Model {
  static get table() {
    return 'users'
  }

  static get primaryKey() {
    return 'id'
  }

  // Relations
  users() {
    return this.belongsToMany('App/Models/Company').pivotTable(
      'companies_users'
    )
  }
}

module.exports = Company
