// import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import FoodPage from './pages/Food/FoodPage'
import CartPage from './pages/Cart/CartPage'
// import LoginPage from './pages/Login/LoginPage'
import LoginPageOkta from './pages/Login/LoginPageOkta'
import RegisterPage from './pages/Register/RegisterPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import AuthRoute from './components/AuthRoute/AuthRoute'
import PaymentPage from './pages/Payment/PaymentPage'
import OrderTrackPage from './pages/OrderTrack/OrderTrackPage'
import ProfilePage from './pages/Profile/ProfilePage'
import OrderPage from './pages/Orders/OrderPage'
import Dashboard from './pages/Dashboard/Dashboard'
import AdminRoute from './components/AdminRoute/AdminRoute'
import FoodsAdminPage from './pages/FoodsAdmin/FoodsAdminPage'
import FoodEditPage from './pages/FoodEdit/FoodEditPage'
import UsersPage from './pages/UsersPage/UsersPage'
import UserEditPage from './pages/UserEdit/UserEditPage'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search/:searchTerm" element={<HomePage />} />
            <Route path="/tag/:tag" element={<HomePage />} />
            <Route path="/food/:id" element={<FoodPage />} />
            <Route path="/cart" element={<CartPage />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/login" element={<LoginPageOkta />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<AuthRoute><CheckoutPage /></AuthRoute>} />
            <Route path="/payment" element={<AuthRoute><PaymentPage /></AuthRoute>} />
            <Route path="/track/:orderId" element={<AuthRoute><OrderTrackPage /></AuthRoute>} />
            <Route path="/profile" element={<AuthRoute><ProfilePage /></AuthRoute>} />
            <Route path="/orders/:filter?" element={<AuthRoute><OrderPage /></AuthRoute>} />
            {/* The :filter? is a route parameter, which means it is optional */}
            <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
            <Route path="/admin/foods/:searchTerm?" element={<AdminRoute><FoodsAdminPage /></AdminRoute>} />
            <Route path="/admin/addFood" element={<AdminRoute><FoodEditPage /></AdminRoute>} />
            <Route path="/admin/editFood/:foodId" element={<AdminRoute><FoodEditPage /></AdminRoute>} />
            <Route path="/admin/users/:searchTerm?" element={<AdminRoute><UsersPage /></AdminRoute>} />
            <Route path="/admin/editUser/:userId" element={<AdminRoute><UserEditPage /></AdminRoute>} />
        </Routes>
    )
}

export default AppRoutes