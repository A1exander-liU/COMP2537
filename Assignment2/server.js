const express = require('express') 
const app = express() 

// const cors = require('cors');
// app.use(cors())

const mongoose = require('mongoose');

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.listen(5010, function (err) {
    if (err) {
        console.log(err);
    }
})

app.use(express.static("./public"))
// get postman

app.get("/timeline", function(req, res) {
    // return back a json of all the docs in the timline collection
    timelineModel.find({}, function(err, timeline) {
        if (err) {
            console.log("Err"+ err)
        }else {
            console.log("Data" + timeline)
        }
    })
    res.json(JSON.stringify(timeline))
})

app.post("/timline/insert", function(req, res) {
    // request to insert a new doc in the timeline collection
    timlineModel.create({
    text: req.body.text,
    hit: req.body.hit,
    time: req.body.time
    })
    // res.send()
})

app.put("/timemline/update/:id", function(req, res) {
    timelineModel.updateOne({
        "_id":  req.params.id 
    }, {$inc: {hits: 1}})
})

app.get("/timeline/remove/:id", function(req, res) {
    timelineModel.remove({
        "_id": req.params.id 
    })
})

app.post("/findPokemonByName", function(req, res) {
    console.log(req.body)
    pokemonModel.find({name: req.body.name}, function(err, found_pokemon) {
        if (err) {
            console.log("Err" + err)
        }else {
            console.log("Data" + found_pokemon)
            res.json(found_pokemon[0])
        }
    })
})

app.post("/findPokemonByType", function(req, res) {
    console.log(req.body.type)
    pokemonModel.find({types: req.body.type}, function(err, found_pokemon) {
        if (err){
            console.log("Err" + err)
        }else {
            console.log("Data" + found_pokemon)
            res.json(found_pokemon)
        }
    })
})

app.post("/findPokemonByWeightRange", function(req, res) {
    pokemonModel.find({$and: [{weight: {$gte: req.body.min_weight}}, {weight: {$lte: req.body.max_weight}}]}, function(err, found_pokemon) {
        if (err){
            console.log("Err" + err)
        }else {
            console.log("Data" + found_pokemon)
            res.json(found_pokemon)
        }
    })
})

app.get("/findPokemonByLowBaseStatTotal", function(req, res) {
    pokemonModel.find({base_stat_total: {$lt: 300}}, function(err, found_pokemon) {
        if (err) {
            console.log("Err" + err) 
        }else {
            console.log("Data" + found_pokemon)
            res.json(found_pokemon)
        }
    })
})

app.get("/findPokemonByModerateBaseStatTotal", function(req, res) {
    pokemonModel.find({$and: [{base_stat_total: {$gte: 300},}, {base_stat_total: {$lt: 550}}]}, function(err, found_pokemon) {
        if (err) {
            console.log("Err" + err) 
        }else {
            console.log("Data" + found_pokemon)
            res.json(found_pokemon)
        }
    })
})

app.get("/findPokemonByHighBaseStatTotal", function(req, res) {
    pokemonModel.find({base_stat_total: {$gte: 550}}, function(err, found_pokemon) {
        if (err) {
            console.log("Err" + err) 
        }else {
            console.log("Data" + found_pokemon)
            res.json(found_pokemon)
        }
    })
})

//when defining a collection follow this naming format:
//-all lowercase
//-has to have an s at the end of the collection name

// mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true});

const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    date: String
});

const pokemonSchema = new mongoose.Schema({
    name: String,
    types: [String],
    weight: Number,
    base_stat_total: Number
})
const timelineModel = mongoose.model("timelinevents", timelineSchema); 
const pokemonModel = mongoose.model("pokemons", pokemonSchema)