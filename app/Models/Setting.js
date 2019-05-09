'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Setting extends Model {
	static get table() {
		return 'settings'
	}

	static get primaryKey() {
		return 'id'
	}
}

module.exports = Setting
