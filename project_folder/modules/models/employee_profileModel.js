const { DataTypes } = require("sequelize");
const db = require("../../config/db/index").DB;
const { DEFAULT_FIELDS_MODEL } = require("../../helpers/modelHelper");

const model = db.define(
	"employee_profile",
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
		place_of_birth: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		date_of_birth: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		gender: {
			type: DataTypes.ENUM("Laki-laki", "Perempuan"),
			allowNull: false,
		},
		is_married: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		prof_pict: {
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
