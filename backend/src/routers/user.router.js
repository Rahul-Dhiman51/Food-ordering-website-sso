import { Router } from "express";
import jwt from "jsonwebtoken";
import { BAD_REQUEST } from "../constants/httpStatus.js";
import handler from "express-async-handler";
import { UserModel } from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth.mid.js";
import admin from "../middleware/admin.mid.js";

const PASSWORD_HASH_SALT_ROUNDS = 10;

const router = Router();

router.post("/login", handler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.send(generateTokenResponse(user));
        return;
    }
    res.status(BAD_REQUEST).send("Invalid email or password");
}))

router.post('/register', handler(async (req, res) => {
    const { name, email, password, address } = req.body

    const user = await UserModel.findOne({ email })
    if (user) {
        res.status(BAD_REQUEST).send('User already exists, please login!')
        return
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS)

    const newUser = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        address,
    }

    const result = await UserModel.create(newUser);
    res.send(generateTokenResponse(result))
}))

router.put('/updateProfile', auth, handler(async (req, res) => {
    const { name, address } = req.body
    const user = await UserModel.findOneAndUpdate(
        { _id: req.user.id },
        { name, address },
        { new: true },
    )

    res.send(generateTokenResponse(user))
}))

router.put('/changePassword', auth, handler(async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const user = await UserModel.findById(req.user.id)

    if (!user) {
        res.status(BAD_REQUEST).send('Change Password Failed!')
        return
    }
    // console.log("ffffffffffffffffffffff")

    const equal = await bcrypt.compare(currentPassword, user.password)

    if (!equal) {
        res.status(BAD_REQUEST).send('Current Password Is Not Correct!')
        return
    }

    // console.log("ssssssssssssssss")
    user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS)
    await user.save()

    res.send()
}))

router.get('/getAll/:searchTerm?', admin, handler(async (req, res) => {
    const { searchTerm } = req.params

    const filter = searchTerm ? { name: { $regex: new RegExp(searchTerm, 'i') } } : {}

    const users = await UserModel.find(filter).select("-password")

    res.send(users)
}))

router.put('/toggleBlock/:userId', admin, handler(async (req, res) => {
    const { userId } = req.params

    if (userId === req.user.id) {
        res.status(BAD_REQUEST).send("Can't block yourself!")
        return
    }

    const user = await UserModel.findById(userId)
    user.isBlocked = !user.isBlocked
    await user.save()

    res.send(user.isBlocked)
}))

router.get('/getById/:userId', admin, handler(async (req, res) => {
    const { userId } = req.params
    // console.log(userId)
    const user = await UserModel.findById(userId).select("-password")

    res.send(user)
}))

router.put('/update', admin, handler(async (req, res) => {
    const { id, name, email, address, isAdmin } = req.body

    await UserModel.findByIdAndUpdate(id, {
        name,
        email,
        address,
        isAdmin,
    })
    res.send()
}))

const generateTokenResponse = (user) => {
    // sign is used to create a token and pass the payload and secret
    //  key to it for verification at the frontend
    // Third argument is an object which contains the expiration time or options
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '5d',
        }
    )

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        isAdmin: user.isAdmin,
        token,
    }
}

export default router;