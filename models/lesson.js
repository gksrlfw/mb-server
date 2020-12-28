const Sequelize = require('sequelize');

module.exports = class Lesson extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      price: {
        type: Sequelize.NUMBER(10),
        allowNull: false,
        // defaultValue=0
      },
      
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Lesson',
      tableName: 'lessons',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {
    // db.Lesson.
  }
};