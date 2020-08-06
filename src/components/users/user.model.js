const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const PostgresORM = require('../config/database.config');
const UserRole = require('./user.role.model');

var User = PostgresORM.define('users', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    firstname: { type: Sequelize.STRING, unique: false, allowNull: false },
    lastname: { type: Sequelize.STRING, unique: false, allowNull: false },
    email: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    resetPasswordExpires: { type: Sequelize.DATE, unique: false, allowNull: true },
    resetPasswordToken: { type: Sequelize.STRING, unique: true, allowNull: true }
}, {
    hooks: {
        beforeCreate: user => {
            // const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, 10);
        },
        beforeUpdate: user => {
            // const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, 10);
        }
    },
    instanceMethods: {
        isPasswordEqual: function(password) {
            return bcrypt.compareSync(password, this.password);
        }
    }
});

var Role = PostgresORM.define('roles', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false }, 
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    description: { type: Sequelize.STRING, unique: true, allowNull: false },
});

Role.belongsToMany(User, { through: UserRole, as: 'users', foreignKey: 'roleid' });

User.belongsToMany(Role, { through: UserRole, as: 'roles', foreignKey: 'userid' });

// (async () => {
//     await PostgresORM.sync()
//     .then(() => console.log('Tables created successfully'))
//     .catch(error => console.log('Failed to create database tables: ', error))
// })()

module.exports = {
    User,
    Role
};