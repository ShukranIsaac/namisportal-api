const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role } = require('./user.model');
const crypto = require('crypto');
const async = require('async');
const Status = require('../status.codes');

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const UIDGenerator = require('../uuid.generate');

const attributes = [ 
    '_id', 'username', 
    ['firstname', 'firstName'], ['lastname', 'lastName'],
    'email', 'resetPasswordExpires',
    'resetPasswordToken'
]

module.exports = {
    authenticate: async ({body: { username, password}, session}, res) => {
        const user = await User.findOne({
            where: { username: username }
        })

        if (!user) {
            return Promise.reject(({
                success: false,
                message: 'Username or password is incorrect',
            }))
        }

        return await comparePassword(password, user.password, (err, isMatch) => {
            if (isMatch) {
                const { id, password,...rest } = user.dataValues;
                const token = jwt.sign({ 
                    sub: id
                }, config.secret);
                
                if (!session.user) {
                    session.user = { ...rest }
                    session.user.token = token;
                }

                return res.status(Status.STATUS_OK)
                    .send(Object.assign(rest, { token: token }))
            }

            return Promise.reject(({
                success: false,
                message: 'Username or password is incorrect'
            }))
        });
    },

    createRoles: async ({ params, body: { roles } , session}, res, next) => {
        if (roles instanceof Array) {
            if (!await User.findOne({
                where: { _id: params.id }
            })) {
                return res.status(Status.STATUS_UN_AUTHORIZED).send({
                    success: false,
                    message: `Unauthorized Request`
                })
            }
            
            const userroles = roles.map(role => ({ 
                _id: UIDGenerator.UUID(), 
                name: role,
                description: role.toUpperCase()
            }))
            res.json(await Role.bulkCreate(userroles, {
                fields: ['_id', 'name', 'description']
            }))
        } else {
            res.status(Status.STATUS_UNPROCESSABLE_ENTITY)
                .send({
                    success: false,
                    message: "Error parsing object"
                });
        }
    },

    createAccount: async ({
        body: {
            username,
            email,
            password,
            firstName,
            lastName,
            roles
        }
    }, res) => {
        // check if user exists
        await userExists(username, res);
        
        const myRoles = await getUserRoles(roles, res);

        // Finally associate these roles with 
        // this user being created
        const user = await User.create({
            _id: UIDGenerator.UUID(),
            username,
            firstname: firstName,
            lastname: lastName,
            email,
            password
        })
        .catch(error => {
            console.log(error)
            res.status(Status.STATUS_INTERNAL_SERVER_ERROR)
                .json(error.errors)
        })
        
        await user.addRole(myRoles)
            .then(() => {
                res.status(Status.STATUS_OK)
                    .json({
                        status: true,
                        message: 'Account successfully created'
                    });
            })
    },

    getAll: async () => await User.findAll({ 
        attributes: attributes,
        include: [{
            model: Role,
            as: 'roles',
            all: true,
            attributes: {
                exclude: ['id']
            },
            through: {
                attributes: [],
            }
        }]
    }),

    getById: async (id) => await User.findOne({ 
        where: { _id: id }, 
        attributes: attributes
    }),

    update: async (id, userParam, res) => {
        let user = await User.findOne({
            where: { _id: id }
        })

        // validate
        if (await getUserId(id) < 0) {
            return Promise.reject({
                success: false,
                message: `User with id ${ id } does not exists`
            });
        }

        if (user.username !== userParam.username && await User.findOne({ 
            where: { 
                username: userParam.username
                // [Op.or]: [{
                //     username: userParam.username, 
                //     email: userParam.email 
                // }]
            }
        })) {
            return Promise.reject({
                success: false,
                message: `Username or Email already in use`
            });
        }
    
        // hash password if it was entered
        if (userParam.password) {
            // const salt = bcrypt.genSaltSync();
            userParam.password = bcrypt.hashSync(userParam.password, 10);
        }

        // If payload contains roles
        let statusMessages = [];
        if (userParam.roles) {
            const nextRoles = await getUserRoles(userParam.roles, res);
            const prevRoles = await getUserUnAssignedRoles(userParam.roles, res);
            
            if (prevRoles.length > 0) {
                statusMessages.push(await user.removeRole(prevRoles).then(() => ({
                    success: true,
                    message: 'Previously assigned roles successfully deleted'
                })))
            }

            if (nextRoles.length > 0) {
                statusMessages.push(await user.addRole(nextRoles).then(() => ({
                    success: true,
                    message: 'New roles successfully assigned'
                })))
            }
        }

        await user.update(userParam);

        // reached thus far, user updated
        statusMessages.push({
            success: true,
            message: "User successfully updated"
        });

        return await user.reload()
            .then(user => user ? 
                res.status(Status.STATUS_OK).send(statusMessages) : 
                res.status(Status.STATUS_INTERNAL_SERVER_ERROR).send({
                    success: false,
                    message: 'User account failed to update. Try again.'
                })
            );
    },

    accountRecovery,

    accountReset,

    delete: async id => await User.destroy({ 
        where: { _id: id },
        attributes: attributes
    })
};

const comparePassword = async (candidatePassword, hash, cb) => {
    return bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) return cb(err);
        return cb(null, isMatch);
    });
}

const userExists = async (username, res) => {
    if (await User.findOne({
        where: { username: username }
    })) {
        return res.status(Status.STATUS_CONFLICT).send({
            success: false,
            message: `The username ${username} is already taken`
        })
    }
}

async function getUserId(id) {
    return await User.findOne({
        where: { _id: id }
    })
    .then(({ dataValues: { id }}) => id)
    .catch(error => error ? -1 : -1)
}

const getUserRoles = async (roles, res) => {
    return await Role.findAll({ attributes: ['id', 'name'] })
    .then(_roles => {
        if(!_roles) {
            return res.status(Status.STATUS_NOT_FOUND).send({
                success: false,
                message: `Not user roles created yet.`
            })
        }

        return Object.entries(roles)
            .map(role => {
                if (role[1]) return role[0]
                else return
            })
            .map(role => {
                if (role) {
                    for (let index = 0; index < _roles.length; index++) {
                        if(role === _roles[index].name) {
                            return _roles[index].id
                        }
                    }
                }
            }).filter(role => role!==null && role!==undefined)
    }).catch(error => {
        console.log(error)
        res.status(Status.STATUS_INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error
        })
    })
}

const getUserUnAssignedRoles = async (roles, res) => {
    return await Role.findAll({ attributes: ['id', 'name'] })
    .then(_roles => {
        if(!_roles) {
            return res.status(Status.STATUS_NOT_FOUND).send({
                success: false,
                message: `Not user roles created yet.`
            })
        }

        return Object.entries(roles)
            .map(role => {
                if (!role[1]) return role[0]
                else return
            })
            .map(role => {
                if (role) {
                    for (let index = 0; index < _roles.length; index++) {
                        if(role === _roles[index].name) {
                            return _roles[index].id
                        }
                    }
                }
            }).filter(role => role!==null && role!==undefined)
    }).catch(error => {
        console.log(error)
        res.status(Status.STATUS_INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error
        })
    })
}

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

                    user.password = bcrypt.hashSync(body.password, 10);
                    // user.resetPasswordToken = undefined;
                    // user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        const { password, ...userWithoutHash } = user;
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