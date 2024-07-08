import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import passport from './config/passport.config.js';
import { dbconnect } from './config/database.config.js';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
import cookieParser from 'cookie-parser';
import { DOMParser } from 'xmldom';
import { Buffer } from 'buffer';

dotenv.config();
dbconnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' // Your frontend URL
}));

// configuring express-session to store session in memory
app.use(session({
    secret: 'your_secret_here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        sameSite: 'None', // Cross-site cookie
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// configuring passport middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware to log session data
app.use((req, res, next) => {
    console.log("SessionId", req.sessionID)
    console.log("SessionData", req.session)
    console.log("cookies", req.cookies)
    next();
});


// SAML callback authentication route
// passport.authenticate middleware was not validating the SAML response correctly
// I have checked the documentation and the configuration seems to be correct
// So I have implemented the SAML response validation (some) manually.
app.post("/login/callback", (req, res, next) => {
    const samlResponse = req.body.SAMLResponse;
    // console.log(samlResponse)
    const decodedResponse = Buffer.from(samlResponse, 'base64').toString('utf-8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(decodedResponse, 'text/xml');

    if (validateSAMLResponse(doc)) {
        const user = extractUserAttributes(doc);
        console.log("User", user)
        req.login(user, (err) => {
            if (err) return next(err);
            return res.redirect("http://localhost:5173/login");
        });
    } else {
        return res.redirect("/login");
    }
});

function validateSAMLResponse(doc) {
    const assertion = doc.getElementsByTagName('saml:Assertion')[0];
    if (!assertion) {
        return false;
    }

    const audience = assertion.getElementsByTagName('saml:Audience')[0];
    if (!audience || audience.textContent !== process.env.OKTA_ISSUER_URI) {
        return false;
    }

    const conditions = assertion.getElementsByTagName('saml:Conditions')[0];
    if (!conditions) {
        return false;
    }

    const recipient = assertion.getElementsByTagName('saml:SubjectConfirmationData')[0].getAttribute('Recipient');
    if (recipient !== process.env.OKTA_RECIPIENT) {
        return false;
    }
    return true;
}

function extractUserAttributes(doc) {
    const attributes = {};
    const attributeNodes = doc.getElementsByTagName('saml:Attribute');
    for (let i = 0; i < attributeNodes.length; i++) {
        const attributeName = attributeNodes[i].getAttribute('Name');
        const attributeValue = attributeNodes[i].getElementsByTagName('saml:AttributeValue')[0].textContent;
        attributes[attributeName] = attributeValue;
    }
    return {
        id: attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        email: attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        name: attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    };
}

// Route to initiate SAML authentication
app.get("/login", passport.authenticate("saml", { failureRedirect: "/login", failureFlash: true }), (req, res) => {
    return res.redirect("http://localhost:5173");
});


// Route to check if the user is authenticated
// As the session are not persisting, the user data is not available so the user is not authenticated
// I have tried to debug it with the help documentation and other resources but couldn't find the issue

app.get("/whoami", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    } else {
        return res.status(200).json({ user: req.user });
    }
});

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('http://localhost:5173/');
        });
    });
});

app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

app.get('*', (req, res) => {
    const indexFilePath = path.join(publicFolder, 'index.html');
    res.sendFile(indexFilePath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
