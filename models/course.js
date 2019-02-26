var mongoose = require('mongoose');

var CourseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    estimatedTime: {
        type: String,
        trim: true
    },
    materialsNeeded: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

var Course = mongoose.model('courses', CourseSchema);
module.exports = Course;