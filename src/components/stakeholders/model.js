const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');
const Contact = require('../contacts/model');
const StakeholderContact = require('./stakeholder.contact');

const Stakeholder = PostgresORM.define('stakeholders', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    about: { type: Sequelize.TEXT, allowNull: false },
    mission: { type: Sequelize.TEXT, allowNull: false },
    vision: { type: Sequelize.TEXT, allowNull: false },
    image: { type: Sequelize.TEXT, unique: true, allowNull: true }
});

const StakeholderType = PostgresORM.define('types', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    about: { type: Sequelize.TEXT, allowNull: false }
})

Contact.belongsToMany(Stakeholder, { 
    through: StakeholderContact, 
    as: 'stakeholders', 
    foreignKey: 'contactid' 
})
Stakeholder.belongsToMany(Contact, { 
    through: StakeholderContact, 
    as: 'contacts', 
    foreignKey: 'stakeholderid'
})

StakeholderType.hasMany(Stakeholder)
Stakeholder.belongsTo(StakeholderType)

module.exports = Stakeholder;