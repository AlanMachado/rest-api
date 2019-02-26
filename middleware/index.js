var User = require('../models/user');

function loggedOut(req, res, next) {
    if (req.session && req.session.userId) {
      return res.redirect('/profile');
    }
    return next();
}
function requiresLogin(req, res, next) {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')

    if (req.session && req.session.userId) {
        return next();
    } else if (login, password) {

        User.authenticate(login, password, (error, user) => {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return next();
            }
        });

    } else {
        var err = new Error('You must be logged in.');
        err.status = 401;
        return next(err);
    }
}
module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;