const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');
const Contact = require('../contacts/model');

const Stakeholder = PostgresORM.define('stakeholders', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    about: { type: Sequelize.TEXT, allowNull: false },
    mission: { type: Sequelize.TEXT, allowNull: false },
    vision: { type: Sequelize.TEXT, allowNull: false },
    image: { type: Sequelize.TEXT, allowNull: true }
});

const StakeholderType = PostgresORM.define('stakeholdertypes', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    about: { type: Sequelize.TEXT, allowNull: false }
})

StakeholderType.hasMany(Stakeholder)
Stakeholder.belongsTo(StakeholderType)

Stakeholder.belongsToMany(Contact, { 
    through: StakeholderType, 
    as: 'contacts', 
    foreignKey: 'contactid' 
})
Stakeholder.belongsToMany(Stakeholder, { 
    through: StakeholderType, 
    as: 'stakeholders', 
    foreignKey: 'stakeholderid' 
})

module.exports = Stakeholder;