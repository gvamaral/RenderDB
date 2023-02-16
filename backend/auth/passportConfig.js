const bcrypt = require("bcryptjs");
const db = require('../db')
const localStrategy = require("passport-local").Strategy;

const matchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match
};


module.exports = function (passport) {
  passport.use(
    new localStrategy(
      async (username, password, done) => {
        try {
          const user = await db.authUserByName(username)
          console.log('after await db.authUserByName');
          console.log(user);
          if (!user) return done(null, false);
          console.log(`user exists :)`);
          const isMatch = (password == user.password) //await matchPassword(password, user.password);
          if (!isMatch) return done(null, false);
          return done(null, { id: user.id, username: user.username });
        }
        catch (error) {
          console.log(`error`);
          done(err)
        }
      })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser(async (id, cb) => {
    try {
      const user = await db.getUserById(id)
      cb(null, user);
    } catch (err) {
      if (err) { cb(err) }
    }
  });

};