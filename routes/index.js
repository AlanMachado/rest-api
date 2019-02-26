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

router.post('/users', mid.requiresLogin, (req, res) => {
    var userToCreate = Object.assign(userBody, req.body);

    if (userToCreate.valid()) {

        User.create(req.body).then(user => {
            res.send(user);
        }).catch(err => {
            res.send(err);
        });
        
    } else {
        res.send('Body not valid!');
    }
});

router.get('/users', (req, res) => {
    User.find({}, userShowProjection).then(users => {
        res.send(users);
    }).catch(err => {
        res.send(err);
    });
});

router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, userShowProjection).then(user =>{
        res.send(user);
    }).catch(err => {
        res.send(err);
    });
});

router.get('/courses', (req, res) => {
    Course.find({}, courseShowProjection).populate('user', userShowProjection)
    .then(courses => {
        res.send(courses);
    }).catch(err => {
        res.send(err);
    });

});

router.get('/courses/:id', (req, res) => {
    Course.findById(req.params.id, courseShowProjection).populate('user', userShowProjection)
    .then(course => {
        res.send(course);
    }).catch(err => {
        res.send(err);
    });
});

router.get('/courses/users/:id', (req, res) => {
    Course.find({user: new ObjectId(req.params.id)}, courseShowProjection).populate('user', userShowProjection)
    .then(courses => {
        res.send(courses);
    }).catch(err => {
        res.send(err);
    });
});

router.post('/courses', mid.requiresLogin, (req, res) => {
    var courseToCreate = Object.assign(courseBody, req.body);

    if (courseToCreate.valid()) {
        Course.create(req.body).then(course => {
            res.send(course);
        }).catch(err => {
            res.send(err);
        });
    } else {
        res.send("Course's Body not ready.");
    }

});

router.put('/courses/:id', mid.requiresLogin, (req, res) => {
    var courseToUpdate = Object.assign(courseBody, req.body);

    if (courseToUpdate.valid()) {
        Course.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(course => {
            res.send(course);
        }).catch(err => {
            res.send(err);
        });
        
    } else {
        res.send("Course's Body not ready.");
    }

});

module.exports = router;