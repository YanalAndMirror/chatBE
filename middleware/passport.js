const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

const { User } = require("../db/models");
const bcrypt = require("bcrypt");

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({
      where: { username },
    });
    let passwordsMatch = user ? bcrypt.compare(password, user.password) : false;
    if (passwordsMatch) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    done(error);
  }
});
exports.jwtStrategy = new JWTStrategy(
  { jwtFromRequest: fromAuthHeaderAsBearerToken(), secretOrKey: "mysecret" },
  async (payload, done) => {
    if (Date.now() > payload.exp) {
      return done(false);
    }
    try {
      const user = await User.findByPk(payload.id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
