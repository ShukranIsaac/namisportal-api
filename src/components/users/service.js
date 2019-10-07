const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./model')

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByIdMongooseUse: async (id) => await User.findById(id).select('-hash')
};

async function authenticate({body: { username, password}, session}) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        
        if (!session.user) {
            session.user = { ...userWithoutHash }
        }
          
        return { ...userWithoutHash, token};
    }
}

async function getAll() {
    return await User.find().select('-hash').lean()
}

async function getById(id) {
    return await User.findById(id).select('-hash').lean()
}

async function getByUsername(username) {
    return await User.findOne({ username }).select('-hash')
}

async function create(userParam) {

    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw `The username ${userParam.username} is already taken'`;
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    try {
       user.save();
       const { hash, ...userWithoutHash } = user.toObject();
       return Promise.resolve(userWithoutHash)
        
    } catch (error) {
        return Promise.reject(error)
    }
}

async function update(id, userParam) {
    let payloadHasRoles = false
    let user = await User.findById(id);
    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }
    let newRoles = {}
    if (userParam.roles){
        payloadHasRoles = true
        newRoles = Object.assign(user.roles, userParam.roles)
    }

    const {roles, ...minusRoles} = userParam
    // copy userParam properties to user
    Object.assign(user, minusRoles, payloadHasRoles ? {roles: newRoles} : {})
    
    await user.save()
    const { hash, ...userWithoutHash } = user.toObject();
    return {user: userWithoutHash}
}

async function _delete(id) {
    return await User.findByIdAndRemove(id).select('-hash').lean()
}