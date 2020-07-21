const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./model')
const crypto = require('crypto');
const async = require('async');

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport')

module.exports = {
    authenticate,
    login,
    getAll,
    getById,
    create,
    update,
    accountRecovery,
    accountReset,
    delete: _delete,
    getByIdMongooseUse: async (id) => await User.findById(id).select('-hash')
};

function accountReset({ body, params, headers }, res, next) {
    async.waterfall([
        function(done) {
            // TODO: Verify token is valid and active
            User.findOne({ 
                resetPasswordToken: params.token, 
                resetPasswordExpires: { $gt: Date.now() } }, 
                function(err, user) {
                    if (!user) {
                        return next(res.json({
                            error: 'Password reset token is invalid or has expired.'
                        }))
                    }

                    user.hash = bcrypt.hashSync(body.password, 10);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        const { hash, ...userWithoutHash } = user.toObject();
                        const token = jwt.sign({ sub: user.id }, config.secret);
                        
                        if (!session.user) {
                            session.user = { ...userWithoutHash }
                        }

                        done(err, { ...userWithoutHash, token})
                    });
                });
            },
            function(user, done) {
                let transport = nodemailer.createTransport(smtpTransport({
                    host: 'smtp.gmail.com',
                    secure: true,
                    port: 465,
                    pool: true,
                    auth: {
                        user: "minigridzada@gmail.com",
                        pass: "@M1nigrids"
                    }
                }));

                const mailOptions = {
                    to: user.email,
                    from: 'minigridzada@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'Hello '+ user.username +',\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n' +
                    'http://' + headers.host + '/login\n\n' +
                    'Yours\n' + 'The Portal Admin\n'
                };

                transport.sendMail(mailOptions, function(err) {
                    if(err) done(err, 'done');

                    res.json({
                        success: 'Success! Your password has been changed.'
                    })
                });
            }
        ], function(err) {
            if (err) return next(res.json({ 
                status: "Failed to reset password("+ 
                body.email +"). Please try again" 
            }));
        }
    );    
}

function accountRecovery({ body, headers }, res, next) {
    async.waterfall([
        function(done) {
            // const token = jwt.sign({ sub: body.email }, config.secret);

            // if(!token) return next(res.json({
            //     error: "Failed to generate auth token!"
            // }))

            // token && done(err, token);
            
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: body.email }, function(err, user) {
                const response = { 
                    error: 'No user account with ' + body.email + "as email",
                };

                if (!user) {
                    return res.json(response);
                }
    
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            let transport = nodemailer.createTransport(smtpTransport({
                host: 'smtp.gmail.com',
                secure: true,
                port: 465,
                pool: true,
                auth: {
                    user: "minigridzada@gmail.com",
                    pass: "@M1nigrids"
                }
            }));

            const mailOptions = {
                to: user.email,
                from: 'minigridzada@gmail.com',
                subject: 'Password Reset',
                text: 'You are receiving this email because you have requested to reset the password for your account.\n\n' +
                    'Please click on the following link, or paste the below link into your browser to complete the process:\n\n' +
                    'http://' + headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this change, please ignore this email and your password will remain unchanged.\n'
            };

            transport.sendMail(mailOptions, function(err) {
                if(err) done(err, 'done');

                res.json({
                    success: 'An e-mail has been sent to ' 
                    + user.email + ' with further instructions.'
                })
            });
        }
    ], function(err) {
        if (err) return next(res.json({ 
            status: "Failed to recover password("+ 
            body.email +"). Please try again" 
        }));
    });
}

async function login({body: { username, password}, session}) {
    return await User.findOne({ username: username }, function(err, user) {
        
        if (!user || err) return null;

        return user.comparePassword(password, user.hash, function(err, isMatch) {
            if (isMatch) {
                const { hash, ...userWithoutHash } = user.toObject();
                const token = jwt.sign({ sub: user.id }, config.secret);
                
                if (!session.user) {
                    session.user = { ...userWithoutHash }
                }

                return {...userWithoutHash, token};
            }
        });
    });
}

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