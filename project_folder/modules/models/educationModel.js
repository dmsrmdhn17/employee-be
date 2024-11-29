const { DataTypes } = require("sequelize");
const db = require("../../config/db/index").DB;
const { DEFAULT_FIELDS_MODEL } = require("../../helpers/modelHelper");

const model = db.define(
	"education",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		employee_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		level: {
			type: DataTypes.ENUM("Tk", "Sd", "Smp", "Sma", "Strata 1", "Strata 2", "Doktor", "Profesor"),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
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
