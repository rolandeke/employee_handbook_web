const LocalStrategy = require("passport-local").Strategy;
const users = require("../models/users");
const bcrypt = require("bcryptjs");

function InitializePassport(passport) {
  try {
    passport.use(
      new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        function (email, password, done) {
          users.findOne({$or: [{ email: email },{username:email}]}, function (err, user) {
            if (err) {
              return done(err);
            }

            //if user is found
            if (!user) {
              return done(null, false, {
                message: "Username or email is invalid",
              });
            }
            if (user) {
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err)
                  return done(null, false, {
                    message: "Username or Password is incorrect",
                  });

                if (isMatch) {
                  return done(null, user);
                }
              });
            }
          });
        }
      )
    );

    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
      users.findById(id, function (err, user) {
        done(err, user);
      });
    });
  } catch (error) {
    throw error;
  }
}
module.exports = InitializePassport;
