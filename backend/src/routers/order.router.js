import { Router } from 'express'
import handler from 'express-async-handler'
import auth from '../middleware/auth.mid.js';
import { BAD_REQUEST, UNAUTHRIZED } from '../constants/httpStatus.js';
import { OrderModel } from '../Models/order.model.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { UserModel } from '../Models/user.model.js';

const router = Router();
router.use(auth)

router.post('/create', handler(async (req, res) => {
    const order = req.body

    if (order.items.length <= 0) res.send(BAD_REQUEST).send('Cart Is Empty!')

    await OrderModel.deleteOne({
        user: req.user.id,
        status: OrderStatus.NEW,
    })

    const newOrder = new OrderModel({ ...order, user: req.user.id })
    await newOrder.save()
    res.send(newOrder)
})
);

router.put('/pay', handler(async (req, res) => {
    // console.log("REQ:::::::::::::::::::::")
    // console.log(req)
    const { paymentId } = req.body;
    // console.log(paymentId)
    const order = await getNewOrderForCurrentUser(req)
    // console.log("ORDER::::::::::::::::::")
    // console.log(order);
    if (!order) {
        res.status(BAD_REQUEST).send('Order Not Found!')
        return
    }
    order.paymentId = paymentId
    order.status = OrderStatus.PAYED;
    await order.save()

    // sendEmailReceipt(order)

    res.send(order._id)
}))

router.get('/track/:orderId', handler(async (req, res) => {
    const { orderId } = req.params
    const user = await UserModel.findById(req.user.id)

    const filter = {
        _id: orderId,
    }

    if (!user.isAdmin) {
        filter.user = user._id
    }

    const order = await OrderModel.findOne(filter)
    if (!order) return res.send(UNAUTHRIZED)

    return res.send(order)
}))

router.get('/newOrderForCurrentUser', handler(async (req, res) => {
    // console.log(req)
    const order = await getNewOrderForCurrentUser(req)
    if (order) res.send(order)
    else res.status(BAD_REQUEST).send()
})
);

router.get('/allstatus', handler(async (req, res) => {
    const allStatus = Object.values(OrderStatus)
    res.send(allStatus)
}))

router.get('/:status?', handler(async (req, res) => {
    const status = req.params.status
    const user = await UserModel.findById(req.user.id)

    const filter = {}
    if (!user.isAdmin) filter.user = user._id
    if (status) filter.status = status

    const orders = await OrderModel.find(filter).sort('-createdAt') // Here '-' in '-createdAt' means descending order
    res.send(orders)
}))

const getNewOrderForCurrentUser = async (req) => (
    await OrderModel.findOne({
        user: req.user.id,
        status: OrderStatus.NEW,
    }).populate('user')
)

export default router