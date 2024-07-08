import React, { useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCart, useLoading } from '../../hooks'
import { pay } from '../../services/orderService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const PaypalButtons = ({ order }) => {

    const initialOptions = {
        clientId: "ASiBkohBdWGIEd26cUf9Ae9B2IO98gnIeJPT38M1qDirWctN9Ft6_GFSnbPuMjyUFxR_sMUcrDRt9_yO",
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider
            options={initialOptions} >

            <Buttons order={order} />
        </PayPalScriptProvider>
    )
}

function Buttons({ order }) {
    const { clearCart } = useCart()
    const [{ isPending }] = usePayPalScriptReducer()
    const { showLoading, hideLoading } = useLoading()
    const navigate = useNavigate()

    useEffect(() => {
        isPending ? showLoading() : hideLoading()
    }, [isPending])

    const createOrder = (data, actions) => {
        // console.log(actions)
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: order.totalPrice,
                    },
                },
            ],
        });
    }

    const onApprove = async (data, actions) => {
        try {
            const payment = await actions.order.capture()
            // console.log("PAYMENT::::")
            // console.log(payment)
            const orderId = await pay(payment.id)
            // console.log("ORDER ID::::::")
            // console.log(orderId)
            clearCart()
            toast.success('Payment Saved Successfully', 'Success')
            navigate('/track/' + orderId)
        } catch (error) {
            toast.error('Payment Save Failed', 'Error')
            // Have to create a logs service in case of error for the admin record
        }
    }

    const onError = (err) => {
        // console.log(err)
        toast.error('Payment Failed', 'Error')
    }

    return (
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
        />
    )

}

export default PaypalButtons