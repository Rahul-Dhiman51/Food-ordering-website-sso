import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import classes from './userEditPage.module.css'
import { useParams } from 'react-router-dom'
import { getById, updateUser } from '../../services/userService'
import Title from '../../components/Title/Title'
import Input from '../../components/Input/Input'
import { EMAIL } from '../../constants/pattern'
import Button from '../../components/Button/Button'

const UserEditPage = () => {

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm()

    const { userId } = useParams()
    // console.log(userId)
    const isEditMode = userId

    useEffect(() => {
        if (isEditMode) loadUser(userId);
    }, [userId])

    const loadUser = async (userId) => {
        const user = await getById(userId)
        // console.log(user)
        reset(user)
        return
    }

    const submit = async (userData) => {
        await updateUser(userData)
    }

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <Title title={isEditMode ? 'Edit User' : 'Add User'} />
                <form onSubmit={handleSubmit(submit)} noValidate>
                    <Input
                        label="Name"
                        {...register('name', {
                            required: true,
                            minLength: 3
                        })}
                        error={errors.name}
                    />
                    <Input
                        label="Email"
                        {...register('email', {
                            required: true,
                            pattern: EMAIL
                        })}
                        error={errors.email}
                    />
                    <Input
                        label="Address"
                        {...register('address', {
                            required: true,
                            minLength: 5
                        })}
                        error={errors.address}
                    />
                    <Input
                        label="Is Admin"
                        type="checkbox"
                        {...register('isAdmin')}
                        error={errors.isAdmin}
                    />

                    <Button type="submit" />
                </form>
            </div>
        </div>
    )
}

export default UserEditPage