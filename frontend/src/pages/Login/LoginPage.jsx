import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../hooks'
import classes from './loginPage.module.css'
import Title from '../../components/Title/Title'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { EMAIL } from '../../constants/pattern'

const LoginPage = () => {

    const {
        handleSubmit,
        register,   //method to register the input
        formState: { errors },  //object that contains the errors
    } = useForm() //hook that we are using to handle the form and its validation 
    const navigate = useNavigate()
    const { user, login } = useAuth()
    const [params] = useSearchParams()  //hook that we are using to get the query parameters (that starts after ?) from the URL
    const returnUrl = params.get('returnUrl')   //method to get the value of the query parameter

    useEffect(() => {
        if (!user) return;

        returnUrl ? navigate(returnUrl) : navigate('/')
    }, [user]);

    const submit = async ({ email, password }) => {
        await login(email, password)
    }

    return (
        <div className={classes.container}>
            <div className={classes.details}>
                <Title title="Login" />
                <form onSubmit={handleSubmit(submit)} noValidate>
                    <Input
                        type="email"
                        label="Email"
                        // This name 'email' in the register method should be the same as the name of the input in submit method
                        {...register('email', {
                            required: true,
                            pattern: EMAIL
                        })}
                        error={errors.email}
                    />
                    <Input
                        type="password"
                        label="Password"
                        // This name 'password' in the register method should be the same as the name of the input in submit method
                        {...register('password', {
                            required: true,
                        })}
                        error={errors.password}
                    />
                    <Button type="submit" text="Login" />

                    <div className={classes.register}>
                        New User? &nbsp;
                        <Link to={`/register${returnUrl ? '?returnUrl=' + returnUrl : ''}`}>
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage