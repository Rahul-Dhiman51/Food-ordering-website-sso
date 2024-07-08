import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as SamlStrategy } from '@node-saml/passport-saml';
import fs from 'fs';

dotenv.config();

const savedUsers = [];

passport.use(
    new SamlStrategy(
        {
            callbackUrl: "http://localhost:3000/login/callback",
            entryPoint: process.env.OKTA_ENTRY_POINT,
            issuer: process.env.OKTA_ISSUER_URI,
            idpCert: process.env.OKTA_CERT, // Ensure this is set correctly
        },
        function (profile, done) {
            console.log("Profile:", profile);
            findByEmail(profile.nameID, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    const newUser = {
                        email: profile.email,
                        name: profile.nameID,
                    };
                    savedUsers.push(newUser);
                    return done(null, newUser);
                }
                return done(null, user);
            });
        }
    )
);

passport.serializeUser((user, done) => {
    const userId = user.name; // Assuming 'name' can serve as a unique identifier
    console.log(`Serializing user ${userId}`);
    done(null, userId); // Serialize using the user's unique identifier
});

passport.deserializeUser((userId, done) => {
    const user = savedUsers.find(u => u.name === userId); // Find user by unique identifier
    console.log(`Deserializing user ${userId}`);
    done(null, user); // Deserialize user object
});

function findByEmail(email, cb) {
    const user = savedUsers.find(user => user.email === email);
    cb(null, user);
}

export default passport;
