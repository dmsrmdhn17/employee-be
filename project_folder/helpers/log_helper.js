/*
Helper ini untuk proses development
*/
class logHelper {
	static keys_of_object_to_string(obj) {
		console.log("===========keys of object=========");
		console.log(Object.keys(obj).toString());
	}
}

module.exports = logHelper;
