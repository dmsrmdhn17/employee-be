const { DataTypes } = require("sequelize");

exports.DEFAULT_FIELDS_MODEL = {
	createdBy: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	createdName: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	createdCode: {
		type: DataTypes.STRING,
		allowNull: true,
	},

	updatedBy: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	updatedName: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	updatedCode: {
		type: DataTypes.STRING,
		allowNull: true,
	},

	deletedBy: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	deletedName: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	deletedCode: {
		type: DataTypes.STRING,
		allowNull: true,
	},
};
