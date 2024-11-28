// const { getTimeZone } = require("../config/db/db_helper");
const momentHelper = require("./moment_wrapperHelper");

class format_dataTimezone {
	static async convertDataTimestamp(data) {
		// const TIMEZONE = await getTimeZone();
		let result = [];
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			const formattedElement = {};

			// Iterate over each key-value pair in the element object
			for (const [key, value] of Object.entries(element)) {
				if (value instanceof Date) {
					// Convert date or timestamp to the desired timezone
					formattedElement[key] = momentHelper.momentFormat(value, "DD-MM-YYYY HH:mm");
				} else {
					// Keep other values as they are
					formattedElement[key] = value;
				}
			}

			result.push(formattedElement);
		}
		return result;
	}
}

module.exports = format_dataTimezone;
