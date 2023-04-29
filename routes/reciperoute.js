const mongoose = require("mongoose");
require("../model/recipeschema");
require("../model/userschema");
const User = mongoose.model("users");
const Recipes = mongoose.model("recipes");
const bcrypt = require('bcryptjs');
const { ObjectId } = require("mongodb");
module.exports = (app) => {
    app.post("/recipe/add", async (req, res) => {
        try {
            const retobj = req.body;
            const Recipe = new Recipes({
                title: retobj.title,
                ingredients: retobj.ingredients,
                userid: retobj.userid,
                cookingsteps: retobj.cookingsteps,
                photos: retobj.photos,
                typeofcuisine: retobj.typeofcuisine,
                mealtype: retobj.mealtype,
                restriction: ["milk", "peanuts"],
                date: new Date(),
                comments: [],
                likes: []
            });

            const response = await Recipe.save();

            await User.findOneAndUpdate(
            { _id: new ObjectId(retobj.userid) }, 
            { $push: { recipe: response._id } }
            );
            
            res.status(200).send(response);
        } catch (err) {
            res.status(500).send({ "error": err })
        }
    }
    );
    app.get("/recipe/getall", async (req, res) => {
        try {
            const response = await Recipes.find({});
            res.status(200).send(response);
        }
        catch (err)
        {
            res.status(500).send({"error":err})
        }
    })
    app.post("/recipe/getbyid", async (req, res) => {
    try {
        const response = await Recipes.find({userid:req.body.userid});
        res.status(200).send(response);
    }
    catch (err)
    {
        res.status(500).send({"error":err})
    }
})
}