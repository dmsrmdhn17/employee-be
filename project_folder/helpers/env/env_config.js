module.exports = {
	// ENV: GRAFANA LOKI
	LOKI_IP: process.env.LOKI_IP,
	LOKI_PORT: process.env.LOKI_PORT,

	// ENV: APP
	BASE_URL: process.env.BASE_URL,
	PORT_EXPRESS: process.env.PORT_EXPRESS,
	APP_AREA: process.env.APP_AREA,
	APP_ENV: process.env.APP_ENV,
	APP_NAME: process.env.APP_NAME,
	SERVICE_NAME: process.env.SERVICE_NAME,
	CLIENT_NAME: process.env.CLIENT_NAME,
	TIMEZONE: process.env.TIMEZONE,

	// ENV: CONNECTION
	DB_NAME: process.env.DB_NAME,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	REDIS_HOST: process.env.REDIS_HOST,
	MAX_PASSWORD_DAYS: process.env.MAX_PASSWORD_DAYS,
	SESSION_TIME: process.env.SESSION_TIME,
	KEY: process.env.KEY,
};
