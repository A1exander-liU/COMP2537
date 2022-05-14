const express = require('express') 
const app = express() 

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

var session = require('express-session')
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

app.listen(process.env.PORT || 5030, function (err) {
    if (err)
        console.log(err);
})

app.use(express.static("./public"))

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/login.html")
})

app.get("/pokedex", function(req, res) {
    if (req.session.authenticated) {
        console.log("User Info" + req.session.current_user)
        res.sendFile(__dirname + "/public/pokedex.html")
    }
    else {
        res.redirect("/")
    }
})

app.post("/findUser", function(req, res) {
    console.log(req.body)
    userModel.find({username: req.body.username}, function(err, found_user) {
        if (err) {
            console.log("Err" + err) 
            res.send("No user could be found with those information.")
        }
        else {
            console.log("Found User Data" + found_user)
            if (req.body.password == found_user[0].password) {
                console.log("Correct username and password")
                req.session.authenticated = true
                req.session.current_user = found_user
                res.send("success")
            }
            else {
                res.send("The password was incorrect, please enter again.")
            }
        }
    })
})

app.post("/signUp", function(req, res) {
    var new_user = new userModel({
        username: req.body.username,
        password: req.body.password,
        favourites: req.body.favourites
    })
    new_user.save(function(err, event) {
        if (err) {
            console.log("Err" + err)
            res.send("Username is unavailable, please choose again.")
        }
        else {
            console.log("Data" + event)
            req.session.current_user = new_user
            res.send("success")
        }
    })
})

app.get("/signOut", function(req, res) {
    req.session.authenticated = false
    res.send("Successfully signed out.")
})

app.get("/timeline", function(req, res) {
    // return back a json of all the docs in the timline collection
    timelineModel.find({}, function(err, timeline) {
        if (err) {
            console.log("Err"+ err)
        }else {
            console.log("Data" + timeline)
            res.json(timeline)
        }
    })
})

app.post("/findEvent", function(req, res) {
    // return back a json of all the docs in the timline collection
    timelineModel.find({event: req.body.event}, function(err, timeline) {
        if (err) {
            console.log("Err"+ err)
        }
        else {
            console.log("Data" + timeline)
            res.json([timeline, req.body.event])
        }
    })
})

app.post("/insertEvent", function(req, res) {
    // request to insert a new doc in the timeline collection
    var timeline_event = new timelineModel({
        event: req.body.event,
        times: req.body.times,
        date: req.body.date
    })
    timeline_event.save(function(err, event) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + event)
        }
    })
    res.send("Successful insertion!")
})

app.post("/updateEvent", function(req, res) {
    console.log("time line event", req.body.event)
    timelineModel.updateOne({event: req.body.event}, {$inc: {times: 1}}, function(err, timeline_event) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + timeline_event)
            res.send("Successful update")
        }
    })
})

app.delete("/removeThisEvent", function(req, res) {
    timelineModel.deleteOne({event: req.body.event}, function(err, this_deleted) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + this_deleted)
            res.send("This event was successfully deleted.")
        }
    })
})

app.delete("/removeAllEvents", function(req, res) {
    timelineModel.deleteMany({}, function(err, all_deleted) {
        if (err) {
            console.log("Err" + err) 
        }
        else {
            console.log("Data" + all_deleted)
            res.send("Successfully deleted all events.")
        }
    })
})

app.get("/findAllPokemons", function(req, res) {
    pokemonModel.find({}, function(err, all_pokemons) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + all_pokemons)
            res.json(all_pokemons)
        }
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

mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{useNewUrlParser: true, useUnifiedTopology: true});

const timelineSchema = new mongoose.Schema({
    event: String,
    times: Number,
    date: String
});

const pokemonSchema = new mongoose.Schema({
    name: String,
    types: [String],
    weight: Number,
    base_stat_total: Number
})

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    favourites: [{
        name: String,
        id: Number,
        types: [String],
        weight: Number,
        height: Number,
        stats: [Number]
    }]
})

const userModel = mongoose.model("users", userSchema)
const timelineModel = mongoose.model("timelinevents", timelineSchema); 
const pokemonModel = mongoose.model("pokemons", pokemonSchema)