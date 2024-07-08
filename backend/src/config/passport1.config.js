// import passport from 'passport';
// import dotenv from 'dotenv';
// import { Strategy as SamlStrategy } from 'passport-saml';

// dotenv.config();

// const savedUsers = [];

// passport.use(new SamlStrategy(
//     {
//         protocol: 'http://',
//         host: 'eb8a-106-77-137-22.ngrok-free.app',
//         path: '/login/callback',
//         entryPoint: 'https://dev-bdxm6gz140k32t7m.us.auth0.com/samlp/how9Q2BhhPiOtQpBqYbhOHESQpCI5aSd',
//         issuer: 'urn:dev-bdxm6gz140k32t7m.us.auth0.com',
//         signatureAlgorithm: 'rsa-sha1',
//         cert: process.env.OKTA_CERT, // cert must be provided
//     },
//     (profile, done) => {
//         // for signon
//         if (!savedUsers.includes(profile)) {
//             savedUsers.push(profile);
//         }

//         return done(null, profile);
//     })
// );

// passport.serializeUser((user, done) => {
//     console.log(user, 'Serializing user');
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     console.log(user, 'Deserializing user')
//     done(null, user);
// });

// export default passport;