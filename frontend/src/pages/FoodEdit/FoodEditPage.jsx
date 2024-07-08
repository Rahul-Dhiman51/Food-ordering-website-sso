import React, { useEffect, useState } from 'react'
import classes from './foodEditPage.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { addFood, getById, updateFood } from '../../services/FoodService'
import Title from '../../components/Title/Title'
import InputContainer from '../../components/InputContainer/InputContainer'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
import { uploadImage } from '../../services/uploadService'

const FoodEditPage = () => {

    const { foodId } = useParams()
    const navigate = useNavigate()
    const [imageUrl, setImageUrl] = useState()
    const isEditMode = !!foodId     // "!!" changes every value into boolean value

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm()

    useEffect(() => {
        if (!isEditMode) return

        getById(foodId).then(food => {
            // console.log(food)
            if (!food) return;
            reset(food)
            setImageUrl(food.imageUrl)
        })
    }, [foodId])

    const submit = async (foodData) => {
        const food = { ...foodData, imageUrl }
        // console.log(food)

        if (isEditMode) {
            await updateFood(food)
            toast.success(`Food "${food.name}" updated successfully!`)
            return
        }

        const newFood = await addFood(food)
        toast.success(`Food "${food.name}" added successfully!`)
        // replace: true does not allow user to go back to the previous url
        navigate('/admin/editFood/' + newFood.id, { replace: true })
    }

    const upload = async (event) => {
        setImageUrl(null)
        const imageUrl = await uploadImage(event)
        setImageUrl(imageUrl)
    }

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <Title title={isEditMode ? 'Edit Food' : 'Add Food'} />
                <form className={classes.form} onSubmit={handleSubmit(submit)} noValidate>
                    <InputContainer label="Select Image">
                        <input type="file" onChange={upload} accept='image/jpeg' />
                    </InputContainer>
                    {imageUrl && (
                        <a
                            href={imageUrl}
                            className={classes.image_link}
                            target="_blank"
                        >
                            <img src={imageUrl} alt="Uploaded image" />
                        </a>
                    )}

                    <Input
                        type="text"
                        label="Name"
                        {...register('name',
                            {
                                required: true,
                                minLength: 5
                            })
                        }
                        error={errors.name}
                    />
                    <Input
                        type="number"
                        label="Price"
                        {...register('price',
                            {
                                required: true
                            })
                        }
                        error={errors.price}
                    />
                    <Input
                        type="text"
                        label="Tags"
                        {...register('tags')}
                        error={errors.tags}
                    />
                    <Input
                        type="text"
                        label="Origins"
                        {...register('origins', { required: true })}
                        error={errors.origins}
                    />
                    <Input
                        type="text"
                        label="Cook Time"
                        {...register('cookTime', { required: true })}
                        error={errors.cookTime}
                    />

                    <Button type="submit" text={isEditMode ? "Update" : "Create"} />
                </form>
            </div>
        </div>
    )
}

export default FoodEditPage