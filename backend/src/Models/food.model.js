import { model, Schema } from "mongoose";

export const FoodSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        tags: { type: [String], default: [] },
        favourite: { type: Boolean, default: false },
        stars: { type: Number, default: 3 },
        imageUrl: { type: String, required: true },
        origins: { type: [String], default: [] },
        cookTime: { type: String, required: true },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true
        },
    }
)

export const FoodModel = model('food', FoodSchema)