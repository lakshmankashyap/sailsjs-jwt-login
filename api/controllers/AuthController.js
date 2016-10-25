/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	authenticate: function(req, res) {
    var email = req.param('email');
    var password = req.param('password');

    var standardErrorMessage = 'The username and password that you entered did not match our records. Please double-check and try again.';

    if (!email || !password) {
      return res.json(401, {err: standardErrorMessage});
    }

    User.findOneByEmail(email, function(err, user) {
      if (!user) {
        return res.json(401, {err: standardErrorMessage});
      }

      User.validPassword(password, user, function(err, valid) {
        if (err) {
          return res.json(401, {err: standardErrorMessage});
        }

        if (!valid) {
          return res.json(401, {err: standardErrorMessage});
        } else {
          res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id})});
        }
      });
    })
  },

  validateRegistrationData: function(req, res) {
    if(!req.body.password || !req.body.confirmPassword || !req.body.email) {
        return res.json(401, {err: 'Required field missing'});
    }

    if(req.body.password.length == 0 || req.body.confirmPassword.length == 0 || req.body.email.length == 0) {
        return res.json(401, {err: 'Required field missing'});
    }

    if(req.body.email.indexOf('@') == -1 ) {
        return res.json(401, {err: 'Email invalid'});
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.json(401, {err: 'Password doesn\'t match'});
    }

    if(req.body.password.length < 8) {
        return res.json(401, {err: 'Password is too short'});
    }    
  },

  register: function(req, res) {
    
    if(this.validateRegistrationData(req, res)){
        return;
    }

    User.findOne({ email: req.body.email})
    .exec(function(err, user) {
        if(!user) {
            User.create({email: req.body.email, password: req.body.password}).exec(function(err, user) {
            if (err) {
                res.json(err.status, {err: err});
                return;
            }
            if (user) {
                res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id})});
            }
            });
        }
        else { // User already exists give generic message back
            return res.json(401, {err: 'Can\'t create user' });
        }
    });
  },

  reset: function(req, res) {
      return res.json(401, {err: 'Not implemented' });
  }
};