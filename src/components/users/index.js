const express = require('express');
const Router = express.Router();
const userService = require('./service');
const jwtm = require('../../middlewares/jwt');
const Status = require('../status.codes');

// routes
Router.post('/authenticate', authenticate);
Router.post('/register', (req, res) => userService.createAccount(req, res));
Router.post('/forgot', recover);
Router.post('/forgot/:token', resetPassword);
Router.get('/:id/logout', jwtm , destroy)
Router.get('/', jwtm, getAll);
Router.get('/current', jwtm, getCurrent);
Router.get('/:id/roles', jwtm, getById);
Router.post('/:id/roles', jwtm, createRoles);
Router.get('/:id', jwtm, getById);
Router.put('/:id', jwtm, update);
Router.patch('/:id', jwtm, update);
Router.delete('/:id', jwtm, _delete);

module.exports = Router;

function createRoles(req, res, next) {
    return userService.createRoles(req, res, next)
}

function resetPassword(req, res, next) {
    return userService.accountReset(req, res, next)
}

function recover(req, res, next) {
    return userService.accountRecovery(req, res, next)
}

function authenticate(req, res, next) {
    userService.authenticate(req, res)
        .catch(err => {
            res.status(Status.STATUS_INTERNAL_SERVER_ERROR)
                .send(err)
            
            console.log(Object.assign(err, { user: req.body.username }))
        });
}

function getAll({ }, res, next) {
    userService.getAll()
        .then(users => {
            const listOfUsers = users.map(({
                dataValues: {
                    roles,
                    ...rest
                }
            }) => ({
                ...rest,
                roles: getUserRoles(roles)
            }))

            return res.json(listOfUsers)
        })
        .catch(err => next(err))
}

function getUserRoles(roles) {
    return JSON.parse(JSON.stringify(Object.entries(roles)
    .reduce((prev, curr) => ({
        ...prev,
        [curr[1].name]: true
    }), {})))
}

function getCurrent(req, res, next) {
    if (req.session.user) {
        return res.status(Status.STATUS_OK)
            .send(req.session.user)
    } else {
        return res.status(Status.STATUS_NOT_FOUND)
            .send({
                success: false,
                message: "User session does not exist"
            })
    }
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user.dataValues) : res.status(404).send({
            success: false,
            message: 'No resource with id: ' + req.params.id,
        }))
        .catch(err => next(err));
}

function update(req, res, next) { 
    userService.update(req.params.id, req.body, res).catch(err => next(err))
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(user => user ? res.json(user) : res.status(404).send({
            success: false,
            message: 'No resource with id: ' + req.params.id,
        }))
        .catch(error => {
            console.log(error);
            next(res.status(400).send({
                success: false,
                error,
            }))
        });
}

function destroy(req, res, next){
    req.session.destroy(function(err) {
        if (err) return res.status(Status.STATUS_INTERNAL_SERVER_ERROR)
            .send(err)

        return res.json({
            success: true, 
            message: "Successfully logout"
        })
    })
}