var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Course = require('../models/course');
var mid = require('../middleware');
var ObjectId = require('mongoose').Types.ObjectId;


const userShowProjection = {firstName: true, lastName: true};
const courseShowProjection = {title: true, user: true};

const userBody = {
    firstName: "", lastName: "", emailAddress: "", password: "",
    valid: function() {
        return this.firstName && this.lastName && this.emailAddress && this.password;
    }
};

const courseBody = {
    title: "", description: "", user: "",
    valid: function() {
        return this.title && this.description && this.user;
    }
};

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

router.post('/users', mid.requiresLogin, (req, res, next) => {
    var userToCreate = Object.assign(userBody, req.body);

    if (userToCreate.valid()) {

        User.create(req.body).then(user => {
            res.send(user);
        }).catch(err => {
            res.send(err);
        });
        
    } else {
        var err = new Error('All fields are required.');
        err.status = 400;
        next(err);
    }
});

router.get('/users', (req, res, next) => {
    User.find({}, userShowProjection).then(users => {
        res.send(users);
    }).catch(err => {
        next(err);
    });
});

router.get('/users/:id', (req, res, next) => {
    User.findById(req.params.id, userShowProjection).then(user =>{
        res.send(user);
    }).catch(err => {
        next(err);
    });
});

router.get('/courses', (req, res, next) => {
    Course.find({}, courseShowProjection).populate('user', userShowProjection)
    .then(courses => {
        res.send(courses);
    }).catch(err => {
        next(err);
    });

});

router.get('/courses/:id', (req, res, next) => {
    Course.findById(req.params.id, courseShowProjection).populate('user', userShowProjection)
    .then(course => {
        res.send(course);
    }).catch(err => {
        next(err);
    });
});

router.get('/courses/users/:id', (req, res, next) => {
    Course.find({user: new ObjectId(req.params.id)}, courseShowProjection).populate('user', userShowProjection)
    .then(courses => {
        res.send(courses);
    }).catch(err => {
        next(err);
    });
});

router.post('/courses', mid.requiresLogin, (req, res, next) => {
    var courseToCreate = Object.assign(courseBody, req.body);

    if (courseToCreate.valid()) {
        Course.create(req.body).then(course => {
            res.send(course);
        }).catch(err => {
            res.send(err);
        });
    } else {
        var err = new Error('Title, description and user are required');
        err.status = 400;
        next(err);
    }

});

router.put('/courses/:id', mid.requiresLogin, (req, res, next) => {
    var courseToUpdate = Object.assign(courseBody, req.body);

    if (courseToUpdate.valid()) {
        Course.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(course => {
            res.send(course);
        }).catch(err => {
            res.send(err);
        });
        
    } else {
        var err = new Error('Title, description and user are required');
        err.status = 400;
        next(err);
    }

});

module.exports = router;