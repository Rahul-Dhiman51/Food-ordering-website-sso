import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../components/Input/Input'
import Title from '../../components/Title/Title'
import classes from './registerPage.module.css'
import Button from '../../components/Button/Button'
import { Link } from 'react-router-dom'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { EMAIL } from '../../constants/pattern'

const RegisterPage = () => {

    const navigate = useNavigate()
    const [params] = useSearchParams()
    const returnUrl = params.get('returnUrl')
    const auth = useAuth()
    const { user } = auth

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm()

    const submit = async (registerData) => {
        await auth.register(registerData)
    }

    useEffect(() => {
        if (!user) return

        returnUrl ? navigate(returnUrl) : navigate('/')
    }, [user])

    return (
        <div className={classes.container}>
            <div className={classes.details}>
                <Title title="Register" />
                <form onSubmit={handleSubmit(submit)} noValidate>
                    <Input
                        type="text"
                        label="Name"
                        {...register('name', {
                            required: true,
                            minLength: 3,
                        })}
                        error={errors.name}
                    />
                    <Input
                        type="email"
                        label="Email"
                        {...register('email', {
                            required: true,
                            pattern: EMAIL
                        })}
                        error={errors.email}
                    />
                    <Input
                        type="password"
                        label="Password"
                        {...register('password', {
                            required: true,
                            minLength: 8,
                        })}
                        error={errors.password}
                    />
                    <Input
                        type="password"
                        label="Confirm Password"
                        {...register('confirmPassword', {
                            required: true,
                            validate: (value) => (value !== getValues('password')
                                ? 'Passwords Do Not Match'
                                : true
                            ),
                        })}
                        error={errors.confirmPassword}
                    />
                    <Input
                        type='text'
                        label='Address'
                        {...register('address', {
                            required: true,
                            minLength: 10,
                        })}
                        error={errors.address}
                    />
                    <Button type="submit" text="Register" />

                    <div className={classes.login}>
                        Already a user? &nbsp;
                        <Link to={`/login?${returnUrl ? 'returnUrl=' + returnUrl : ''}`}>
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage