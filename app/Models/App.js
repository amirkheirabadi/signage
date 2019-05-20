'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class App extends Model {
	static get table() {
		return 'apps'
	}

	static get primaryKey() {
		return 'id'
	}
}

module.exports = App
