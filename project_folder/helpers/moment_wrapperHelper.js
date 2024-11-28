const moment = require("moment");
const momentTz = require("moment-timezone");
const env_config = require("../helpers/env/env_config");

class moment_wrapperHelper {
	covert_string_to_date_and_check(dateString, format = moment.ISO_8601) {
		try {
			dateString = dateString.replace(" ", "+");
			const date = moment(dateString, format);
			return { date: this.convert_date_From_Localtimezone(date), valid: date.isValid() };
		} catch (error) {
			return { date: "Invalid Date", valid: false, error };
		}
	}
	convert_to_UTC(datetimeString) {
		try {
			// Parse the datetime string while considering the timezone offset
			const momentObj = moment.parseZone(datetimeString);

			// Check if the datetime string was valid
			if (!momentObj.isValid()) {
				throw new Error("Invalid datetime string");
			}

			// Convert the moment object to UTC
			const momentUtc = momentObj.utc();

			// Format the UTC datetime string as needed
			const formattedUtc = momentUtc.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

			return formattedUtc;
		} catch (error) {
			console.error("Error converting datetime to UTC:", error.message);
			throw Error(error);
		}
	}
	convert_date_From_Localtimezone(input) {
		try {
			// Your given time in UTC+0
			const timeUtc0 = this.convert_to_UTC(input); // '2024-05-26T19:53:00.000+00:00'

			// Convert the time to a moment object in UTC
			const momentUtc0 = momentTz.utc(timeUtc0.toString());

			// Convert the time to UTC+7 using moment-timezone
			console.log(env_config.TIMEZONE, "||", "Asia/Bangkok");
			const momentUtc7 = momentUtc0.tz(env_config.TIMEZONE || "Asia/Bangkok"); // Asia/Bangkok is UTC+7

			// Format the time as needed
			const formattedTimeUtc7 = momentUtc7.format("YYYY-MM-DD HH:mm:ss.SSSZ");

			return formattedTimeUtc7;
		} catch (error) {
			throw Error(error);
		}
	}
	get_timezone_offset = (timezone) => {
		const validTimezones = moment.tz.names();
		if (!validTimezones.includes(timezone)) {
			throw new Error("Invalid timezone");
		}
		// Get the current time in the specified timezone
		const currentTimeInTimezone = moment.tz(timezone);

		// Get the UTC offset in the format +07:00
		const utcOffset = currentTimeInTimezone.format("Z");

		return utcOffset;
	};
	get_start_finish_from_input = (date) => {
		// pisah helper
		let date_start = this.convert_date_From_Localtimezone(date);
		date_start = date_start.toString();
		// let date_converted = date_start.toString();
		let date_finish = moment(date_start, "YYYY-MM-DD HH:mm:ss.SSSZ").format("YYYY-MM-DD").toString();
		date_finish = `${date_finish} 23:59:59.000${this.get_timezone_offset(env_config.TIMEZONE)}`;
		date_start = moment(date_start, "YYYY-MM-DD HH:mm:ss.SSSZ").format("YYYY-MM-DD").toString();
		date_start = `${date_start} 00:00:00.000${this.get_timezone_offset(env_config.TIMEZONE)}`;
		return { date_start, date_finish };
	};
	is_date_from_yesterday(date) {
		// Parse the input date
		const inputMoment = moment(date, "YYYY-MM-DD HH:mm:ss.SSSZ", true);

		// Check if inputMoment is valid
		if (!inputMoment.isValid()) {
			throw new Error("Invalid date format");
		}

		// Get the current date at the start of the day (midnight)
		const today = moment().subtract(1, "minute").startOf("day");

		// Calculate yesterday's date at the start of the day (midnight)
		const yesterday = moment().subtract(1, "days").startOf("day");

		// // Compare input date with yesterday's date
		// console.log({ yesterday, today, input: inputMoment });
		// console.log(inputMoment.isBefore(yesterday), inputMoment.isBefore(today));

		// Return true if the input date is not from yesterday
		return inputMoment.isBefore(today) || inputMoment.isBefore(yesterday);
	}
	momentTanggalLocal_DD_MM_YYYY(date) {
		return moment.tz(date, `${env_config.TIMEZONE}`).format("DD-MM-YYYY");
	}

	momentFormat(date, format = "DD-MM-YYYY") {
		return moment.tz(date, `${env_config.TIMEZONE}`).format(format);
	}

	momentTimestampFileName(date) {
		return moment.tz(date, `${env_config.TIMEZONE}`).format("YYYYMMDD-HHmmss");
	}
}

let momentHelper = new moment_wrapperHelper();
module.exports = momentHelper;
