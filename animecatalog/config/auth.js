var mongoose = require('mongoose'),
    passport = require('passport'),
    User = require('../models/user').User;

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());