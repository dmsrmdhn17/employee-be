const { DataTypes } = require("sequelize");
const db = require("../../config/db/index").DB;
const { DEFAULT_FIELDS_MODEL } = require("../../helpers/modelHelper");

const model = db.define(
	"employee_family",
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
		identifier: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		job: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		place_of_birth: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		date_of_birth: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		religion: {
			type: DataTypes.ENUM("Islam", "Katolik", "Buda", "Protestan", "Konghucu", "Hindu"),
			allowNull: false,
		},
		is_life: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		is_divorced: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		relation_status: {
			type: DataTypes.ENUM("Suami", "Istri", "Anak", "Anak Sambung"),
			allowNull: false,
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
