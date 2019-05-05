"use strict";

class Messages {
	static normalizeMessages(msg) {
		let str = [];
		for (const st of msg) {
			const filedsValid = st.field;
			const messageValid = st.validation;
			str.push(filedsValid + " " + messageValid);
		}

		return str;
	}
}

module.exports = Messages;
