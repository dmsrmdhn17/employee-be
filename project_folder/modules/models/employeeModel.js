const { DataTypes, Sequelize } = require("sequelize");
const db = require("../../config/db/index").DB;
const { DEFAULT_FIELDS_MODEL } = require("../../helpers/modelHelper");

const model = db.define(
	"employee",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nik: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		...DEFAULT_FIELDS_MODEL,
	},
	{
		schema: "public",
		paranoid: true,
		freezeTableName: true,
	},
);

// model.sync({ alter: true });
module.exports = model;
