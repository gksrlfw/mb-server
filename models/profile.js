const Sequelize = require('sequelize');

module.exports = class Profile extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      aboutMe: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      carrer: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Profile',
      tableName: 'profiles',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Profile.belongsTo(db.User);
  }
};