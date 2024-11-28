// requestContext.js
let currentRequest = null;

const setRequest = (req) => {
	currentRequest = req;
};

const getRequest = () => currentRequest;

module.exports = { setRequest, getRequest };
