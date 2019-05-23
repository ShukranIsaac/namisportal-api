const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    roles: {
        writer: {type: Boolean, default: false},
        publisher: {type: Boolean, default: false},
        admin: {type: Boolean, default: false}
    },
});

UserSchema.plugin(mongooseStringQuery)

UserSchema.methods.canPlayRoleOf = function(role) {
    if (this.roles[role]) {
        return true
    }else{
        return false
    }
};

module.exports = mongoose.model('User', UserSchema)