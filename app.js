const express = require('express');
const path = require('path');

const inventory = require('./inventory_schema.js')
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const crypto = require('crypto');
const codeVerifier = crypto.randomBytes(32).toString('base64url'); // 32 bytes of random data

const jwt = require('jsonwebtoken');
const cors = require('cors');
const { exec } = require('child_process');

// require("dotenv").config({ path: path.resolve(__dirname, '.env') });
const router = express.Router();

const siteRoute = process.env.SCRIBBLE_FRONTEND_SITE // "https://scribble-website.netlify.app"

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

router.use(cors({
    origin: siteRoute, // Frontend URL
    credentials: true, // Allow cookies to be sent
}));

// app.use(express.static(path.join(__dirname, 'client/build')));
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(express.json());

router.use(session({
    secret: 'keysgogogo', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to `true` if using HTTPS (ngrok's static URLs don't support HTTPS)
        maxAge: 1000 * 60 * 60 * 24, // 1 day (optional)
    },
    store: MongoStore.create({
        mongoUrl: process.env.SCRIBBLE_MONGOOSEDB,
        // ... other options if needed
    }),
}));

mongoose.connect(process.env.SCRIBBLE_MONGOOSEDB).then(() => {
    console.log("Connected to MongodDB")
}).catch(err => {
    console.error("Error connecting to database")
})
    

// Initialize Passport.js
router.use(passport.initialize());
router.use(passport.session());

passport.use(new DiscordStrategy({
    clientID: "1020275006778921020", // Replace with your client ID
    clientSecret: process.env.SCRIBBLE_BOT_TOKEN, // Use a separate environment variable for client secret
    callbackURL: `${process.env.SCRIBBLE_BACKEND_API}/auth/callback`,
    scope: ['identify', 'email'], // Request user profile and email
},
    (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        inventory.findOne({ userID: profile.id })
            .then(user => {
                console.log(user)
                if (user) {
                    // Document exists, so do nothing (or handle it differently if needed)
                    done(null, user);
                } else {
                    // Document does not exist, so create a new one
                    inventory.insertOne({
                        userID: profile.id,
                        username: profile.username,
                        profile_picture: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=1024`,
                        // Add other fields as needed
                    })
                        .then(newUser => {
                            done(null, newUser);
                        })
                        .catch(err => {
                            done(err, null);
                        });
                }
            })
            .catch(err => {
                console.error(err);
                done(err, null);
            });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.userID); // Serialize user to just the userID
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await inventory.findOne({ userID: id });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send('Unauthorized');
    }

    jwt.verify(token, 'amogus', (err, decoded) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = decoded;
        next();
    });
}

router.use('/user', verifyToken)
router.use('/logout', verifyToken)
router.use('/edit-username', verifyToken)

router.get('/', (req, res) => {
    res.send('Scribble Website API root endpoint');
});

router.get('/status', (req, res) => {
    res.send('Scribble API status endpoint');
});

router.get('/user', async (req, res) => {
    console.log("user")
    try {
        // // Verify JWT token from cookies
        // const token = req.cookies.token; // Get token from HTTP-only cookie

        // if (!token) return res.status(401).json({ message: 'No token found, unauthorized' });

        // // Decode token to get the userID
        // const decoded = jwt.verify(token, 'amogus');
        // const userID = decoded.userID;

        // console.log(userID)
        const userID = req.user.userID

        // Fetch user data from MongoDB
        let userData = await inventory.findOne({ userID: userID });

        // If user data exists, render the home page with user data
        if (userData) {
            // Calculate totalCharacters and uniqueCharacters
            let totalCharacters = 0;
            let uniqueCharacters = 0;
            for (const character in userData.characters) {
                totalCharacters += userData.characters[character].amount;
                if (userData.characters[character].amount > 0) {
                    uniqueCharacters++;
                }
            }

            // Send user data as JSON to the frontend
            res.json({
                ...userData._doc
            });
        } else {
            // If user data does not exist, return 404
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

router.get('/auth/callback', passport.authenticate('discord', { failureRedirect: '/login' }), (req, res) => {
    // Generate JWT
    console.log("hello")

    const token = jwt.sign(
        { userID: req.user.userID, username: req.user.username },
        // process.env.SCRIBBLE_JWT_SECRET, // Secret key for signing
        "amogus",
        { expiresIn: '100d' } // Token expiration
    );

    // Send JWT to the frontend as a cookie or in the response
    res.cookie('token', token, {
        httpOnly: true, // Prevent JavaScript access to the cookie
        secure: true, // Only send over HTTPS in production
        sameSite: 'none', // Only send the cookie for same-origin requests
    });
    res.redirect(`${siteRoute}/#/user`);
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,  // Make sure it's consistent with how it was set
        sameSite: 'None' // Make sure it's consistent with how it was set
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
