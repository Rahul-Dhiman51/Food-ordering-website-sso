import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'cart'
const EMPTY_CART = {
    items: [],
    totalPrice: 0,
    totalCount: 0
}

export const CartProvider = ({ children }) => {

    const initCart = getCartFromLocalStorage()
    const [cartItems, setCartItems] = useState(initCart.items);
    const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
    const [totalCount, setTotalCount] = useState(initCart.totalCount);

    useEffect(() => {
        const totalPrice = sum(cartItems.map(item => item.price))
        const totalCount = sum(cartItems.map(item => item.quantity))
        setTotalPrice(totalPrice);
        setTotalCount(totalCount);

        localStorage.setItem(CART_KEY, JSON.stringify({ items: cartItems, totalPrice, totalCount }));
    }, [cartItems])


    ///For this function i can't use const method of defining function cause it will give me error
    ///as we can not use a const without initializing it. So i have to use function keyword to define it.
    function getCartFromLocalStorage() {
        const storedCart = localStorage.getItem(CART_KEY);
        return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
    }

    const sum = (items) => {
        return items.reduce((prevValue, currValue) => prevValue + currValue, 0)
    }

    const removeFromCart = (foodId) => {
        const filteredItems = cartItems.filter(item => item.food.id !== foodId)
        setCartItems(filteredItems)
    }

    const changeQuantity = (cartItem, newQuantity) => {
        const { food } = cartItem

        const changedCartItem = {
            ...cartItem,
            quantity: newQuantity,
            price: food.price * newQuantity
        }

        setCartItems(
            cartItems.map((item) => (item.food.id === food.id ? changedCartItem : item))
        )
    }

    const addToCart = (food) => {
        const cartItem = cartItems.find((item) => item.food.id === food.id)
        if (cartItem) {
            changeQuantity(cartItem, cartItem.quantity + 1);
        } else {
            setCartItems([...cartItems, { food, quantity: 1, price: food.price }])
        }
    }

    const clearCart = () => {
        localStorage.removeItem(CART_KEY)
        const { items, totalPrice, totalCount } = EMPTY_CART;
        setCartItems(items)
        setTotalCount(totalCount)
        setTotalPrice(totalPrice)
    }

    return (
        <CartContext.Provider value={{ cart: { items: cartItems, totalPrice, totalCount }, removeFromCart, changeQuantity, addToCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext);