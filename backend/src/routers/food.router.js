import { Router } from "express";
import { FoodModel } from "../Models/food.model.js";
import handler from "express-async-handler";
import admin from "../middleware/admin.mid.js";

const router = Router();

router.get('/', handler(async (req, res) => {
    const foods = await FoodModel.find({})
    res.send(foods);
}))

router.put('/', admin, handler(async (req, res) => {
    const { id, name, price, tags, favourite, imageUrl, origins, cookTime } = req.body
    // console.log(req.body)

    await FoodModel.updateOne(
        { _id: id },
        {
            name,
            price,
            // after update tags are coming as string. Converting them into array
            tags: tags.split ? tags.split(',') : tags,
            favourite,
            imageUrl,
            origins: origins.split ? origins.split(',') : origins,
            cookTime
        }
    )
    res.send()
}))

router.post('/', admin, handler(async (req, res) => {
    const { name, price, tags, favourite, imageUrl, origins, cookTime } = req.body

    const food = new FoodModel({
        name,
        price,
        // after update tags are coming as string. Converting them into array
        tags: tags.split ? tags.split(',') : tags,
        favourite,
        imageUrl,
        origins: origins.split ? origins.split(',') : origins,
        cookTime
    })

    await food.save()

    res.send(food)
}))

router.delete('/:foodId', admin, handler(async (req, res) => {
    const { foodId } = req.params
    await FoodModel.deleteOne({ _id: foodId })
    res.send()
}))

router.get('/tags', handler(async (req, res) => {
    const tags = await FoodModel.aggregate([
        {
            $unwind: '$tags',
        },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                name: '$_id',
                count: '$count',
            },
        }
    ]).sort({ count: -1 })
    // -1 means decending

    const all = {
        name: 'All',
        count: await FoodModel.countDocuments(),
    }

    tags.unshift(all)   // add all to the beginning of the array
    res.send(tags);
}))

router.get('/search/:searchTerm', handler(async (req, res) => {
    // console.log(req.params)
    const { searchTerm } = req.params;
    const searchRegex = new RegExp(searchTerm, 'i'); // i means case insensitive

    // const foods = sample_foods.filter((food) =>
    //     food.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    const foods = await FoodModel.find({ name: { $regex: searchRegex } })
    res.send(foods);
}))

router.get('/tag/:tag', handler(async (req, res) => {
    const { tag } = req.params;
    // console.log(tag);
    // const foods = sample_foods.filter((item) => {
    //     // console.log(item.tags);
    //     return item.tags?.includes(tag)
    // });
    // console.log(foods);
    const foods = await FoodModel.find({ tags: tag })
    res.send(foods);
}))

//everything after /: is a parameter that we can access with req.params
// if we go to /food/123, req.params will be { foodId: '123' }
// if we declare this route at the top, it will match /food/search, /food/tag, etc
// so we need to declare it at the bottom

router.get('/:foodId', handler(async (req, res) => {
    const { foodId } = req.params;
    const food = await FoodModel.findById(foodId);
    // console.log(food)
    res.send(food);
}))
// router.get('/:id', (req, res) => { })

export default router;