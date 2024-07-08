import React from 'react'
import { useForm } from 'react-hook-form'
import Title from '../Title/Title'
import Input from '../Input/Input'
import { useAuth } from '../../hooks'
import { changePassword } from '../../services/userService'
import Button from '../Button/Button'

const ChangePassword = () => {

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors }
    } = useForm()

    const { changePassword } = useAuth()

    const submit = (passwords) => {
        changePassword(passwords)
    }

    return (
        <div>
            <Title title="Change Password" />
            <form onSubmit={handleSubmit(submit)}>
                <Input
                    type="password"
                    label="Current Password"
                    {...register('currentPassword', {
                        required: true
                    })}
                    error={errors.currentPassword}
                />
                <Input
                    type="password"
                    label="New Password"
                    {...register('newPassword', {
                        required: true,
                        minLength: 8,
                    })}
                    error={errors.newPassword}
                />
                <Input
                    type="password"
                    label="Confirm Password"
                    {...register('ConfirmNewPassword', {
                        required: true,
                        validate: value => value != getValues('newPassword')
                            ? 'Passwords Do Not Match'
                            : true,
                    })}
                    error={errors.newPassword}
                />
                <Button type="submit" text="Change" />
            </form>
        </div>
    )
}

export default ChangePassword