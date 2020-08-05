const express = require('express');
const Router = express.Router();
const userService = require('./service');
const jwtm = require('../../middlewares/jwt');

// routes
Router.post('/authenticate', authenticate);
Router.post('/register', (req, res) => userService.createAccount(req, res));
Router.post('/forgot', recover);
Router.post('/forgot/:token', resetPassword);
Router.get('/logout/:id', destroy)
Router.get('/test', play);
Router.get('/', getAll);
Router.get('/current', getCurrent);
Router.get('/:id/roles', getById);
Router.post('/:id/roles', createRoles);
Router.get('/:id', getById);
Router.put('/:id', update);
Router.patch('/:id', update);
Router.delete('/:id', _delete);

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
    const response = { 
        message: 'Username or password is incorrect' 
    };
    
    userService.authenticate(req)
        .then(user => user ? res.json(user) : res.status(400).json(response))
        .catch(err => next(err));
}

function getAll({ }, res, next) {
    userService.getAll()
        .then(users => {
            // const listOfUsers = users.map(({
            //     dataValues: {
            //         roles,
            //         ...rest
            //     }
            // }) => ({
            //     ...rest,
            //     roles: roles.reduce((prev, curr) => ({
            //         [prev.dataValues.name]: true,
            //         [curr.dataValues.name]: true
            //     }))
            // }))
            // console.log(listOfUsers)
            return res.json(users)
        })
        .catch(err => next(err))
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
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
    userService.update(req.params.id, req.body)
        .then((user) => res.json(user))
        .catch(err => next(err))
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(user => user ? res.json(user.dataValues) : res.status(404).send({
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

function play(req, res, next) {
    userService.getById(req.session.user._id)
        .then((user) => {
            user.roles.writer = true
            console.log(user.canPlayRoleOf('publisher'))
            console.log(req.session.user)
            return res.json(user)
        })
        .catch(err => next(err));
}

function destroy(req, res, next){
    req.session.destroy(function(err) {
        if (err) return;

        res.json({
            success: true, 
            message: "successful logout"
        })
    })
}