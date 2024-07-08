import jwt from 'jsonwebtoken'
import { UNAUTHRIZED } from '../constants/httpStatus.js'


export default (req, res, next) => {
    const token = req.headers.access_token
    if (!token) {
        return res.status(UNAUTHRIZED).send()
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
    } catch (error) {
        return res.status(UNAUTHRIZED).send()
    }

    next()
}