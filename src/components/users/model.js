const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const PostgresORM = require('../config/database.config');

var User = PostgresORM.define('users', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    firstName: { type: Sequelize.STRING, unique: false, allowNull: false },
    lastName: { type: Sequelize.STRING, unique: false, allowNull: false },
    email: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    resetPasswordExpires: { type: Sequelize.DATE, unique: false, allowNull: true },
    resetPasswordToken: { type: Sequelize.STRING, unique: true, allowNull: true },
    roles: { type: Sequelize.JSON, allowNull: false }
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }
    },
    instanceMethods: {
        isPasswordEqual: function(password) {
            return bcrypt.compareSync(password, this.password);
        },
        comparePassword: function(candidatePassword, hash, cb) {
            return bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
                if (err) return cb(err);
                return cb(null, isMatch);
            });
        },
        canPlayRoleOf: function(role) {
            if (this.roles[role]) {
                return true
            }else{
                return false
            }
        }
    }
});

(async () => {
    await PostgresORM.sync()
    .then(() => console.log('Tables created successfully'))
    .catch(error => console.log('Failed to create database tables: ', error))
})()

module.exports = User;