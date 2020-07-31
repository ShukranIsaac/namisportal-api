const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./model');
const crypto = require('crypto');
const async = require('async');
const Status = require('../status.codes');

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const UIDGenerator = require('../uuid.generate');

const attributes = {
    exclude: ['id', 'password']
}

module.exports = {
    authenticate,

    createAccount: async function({
        body: {
            username,
            email,
            password,
            firstName,
            lastName,
            roles
        }
    }, res) {
        
        if (await User.findOne({ username: username })) {
            throw `The username ${username} is already taken'`;
        }

        return await User.create({
            _id: UIDGenerator.UUID(),
            username,
            firstName,
            lastName,
            email,
            password,
            roles
        }).then(user => {
            delete user.dataValues.password;
            delete user.dataValues.id;
            res.status(Status.STATUS_OK)
                .json(user.dataValues);
        }).catch(error => {
            console.log(error)
            res.status(Status.STATUS_INTERNAL_SERVER_ERROR)
                .json(error.errors)
        })
    },

    login: async ({body: { username, password}, session}) => {
        // const data = 
        return await User.findOne({ 
            username: username 
        }, function(err, user) {
            
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
    },

    getAll: async () => await User.findAll({ attributes }),

    getById: async (id) => await User.findOne({ where: { _id: id }, attributes }),

    update,

    accountRecovery,

    accountReset,

    delete: async id => await User.destroy({ where: { _id: id }}),

    getByIdMongooseUse: async (id) => await User.findById(id)
};

async function myCustomMethod(ctx){
    let cmd = await ctx.sendCommand(
        'AUTH PLAIN ' +
            Buffer.from(
                '\u0000' + ctx.auth.credentials.user + '\u0000' + ctx.auth.credentials.pass,
                'utf-8'
            ).toString('base64')
    );

    if(cmd.status < 200 || cmd.status >=300){
        throw new Error('Failed to authenticate user: ' + cmd.text);
    }
}

async function accountReset({ body, params, headers }, res, next) {
    async.waterfall([
        function(done) {
            // TODO: Verify token is valid and active
            User.findOne({ 
                resetPasswordToken: params.token, 
                resetPasswordExpires: { $gt: Date.now() } }, 
                function(err, user) {
                    if (!user) {
                        return next(res.status(401).json({
                            error: 'Password reset token is invalid or has expired.'
                        }))
                    }

                    user.hash = bcrypt.hashSync(body.password, 10);
                    // user.resetPasswordToken = undefined;
                    // user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        const { hash, ...userWithoutHash } = user.toObject();
                        const token = jwt.sign({ sub: user.id }, config.secret);

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
                        type: 'custom',
                        // forces Nodemailer to use custom handler
                        method: 'MY-CUSTOM-METHOD', 
                        user: "minigridzada@gmail.com",
                        pass: "@M1nigrids"
                    },
                    customAuth: {
                        'MY-CUSTOM-METHOD': myCustomMethod
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

                    res.status(200).json({
                        success: 'Success! Password changed'
                    })
                });

                transport.close();
            }
        ], function(err) {
            if (err) return next(res.status(400).json({ 
                status: "Failed to reset password("+ 
                body.email +"). Please try again" 
            }));
        }
    );    
}

function accountRecovery({ body }, res, next) {
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
                    return res.status(401).json(response);
                }
    
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
                user.save(function(err) {
                    done(err, token, user)
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
                    type: 'custom',
                    // forces Nodemailer to use custom handler
                    method: 'MY-CUSTOM-METHOD', 
                    user: "minigridzada@gmail.com",
                    pass: "@M1nigrids"
                },
                customAuth: {
                    'MY-CUSTOM-METHOD': myCustomMethod
                }
            }));

            const mailOptions = {
                to: user.email,
                from: 'minigridzada@gmail.com',
                subject: 'Password Reset',
                text: `You are receiving this email because you have requested to reset the password for your account.\n\n` +
                    `Please copy the AUTH TOKEN and paste it into the AUTH form field to complete the process:\n\n` +
                    `TOKEN: ${token}\n\n` +
                    `If you did not request this change, please ignore this email and your password will remain unchanged.\n`
            };

            transport.sendMail(mailOptions, function(err) {
                if(err) done(err, 'done');

                return res.status(200).json({
                    success: 'An e-mail has been sent to ' 
                    + user.email + ' with further instructions.'
                })
            });

            transport.close();
        }
    ], function(err) {
        if (err) return next(res.status(400).json({ 
            status: "Failed to recover password("+ 
            body.email +"). Please try again" 
        }));
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