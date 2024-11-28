class formatHelper {
	static age_to_string = (dateString, dateNowCustom = null) => {
		let now = dateNowCustom === null ? new Date() : new Date(dateNowCustom);

		let yearNow = now.getYear();
		let monthNow = now.getMonth();
		let dateNow = now.getDate();

		let dob = new Date(dateString);

		let yearDob = dob.getYear();
		let monthDob = dob.getMonth();
		let dateDob = dob.getDate();
		let age = {};
		let ageString = "";
		let yearString = "";
		let monthString = "";
		let dayString = "";

		let yearAge = yearNow - yearDob;
		let monthAge = "";
		let dateAge = "";
		if (monthNow >= monthDob) monthAge = monthNow - monthDob;
		else {
			yearAge--;
			monthAge = 12 + monthNow - monthDob;
		}

		if (dateNow >= dateDob) dateAge = dateNow - dateDob;
		else {
			monthAge--;
			dateAge = 31 + dateNow - dateDob;

			if (monthAge < 0) {
				monthAge = 11;
				yearAge--;
			}
		}

		age = {
			years: yearAge,
			months: monthAge,
			days: dateAge,
		};

		if (age.years > 1) yearString = " th";
		else yearString = " th";
		if (age.months > 1) monthString = " bl";
		else monthString = " bl";
		if (age.days > 1) dayString = " hr";
		else dayString = " hr";

		if (age.years > 0 && age.months > 0 && age.days > 0) ageString = age.years + yearString + " " + age.months + monthString + " " + age.days + dayString;
		else if (age.years === 0 && age.months === 0 && age.days > 0) ageString = "0 th 0 bl " + age.days + dayString;
		else if (age.years > 0 && age.months === 0 && age.days === 0) ageString = age.years + yearString + "0 bl 0 hr";
		else if (age.years > 0 && age.months > 0 && age.days === 0) ageString = age.years + yearString + " " + age.months + monthString + " 0 hr";
		else if (age.years === 0 && age.months > 0 && age.days > 0) ageString = "0 th" + age.months + monthString + " " + age.days + dayString;
		else if (age.years > 0 && age.months === 0 && age.days > 0) ageString = age.years + yearString + " 0 bl " + age.days + dayString;
		else if (age.years === 0 && age.months > 0 && age.days === 0) ageString = "0 th 0 bl " + age.months + monthString;
		else ageString = "0 th 0 bl 1hr";

		return ageString;
	};
}

module.exports = formatHelper;
