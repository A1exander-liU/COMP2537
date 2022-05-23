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

app.listen(process.env.PORT || 5003, function (err) {
    if (err)
        console.log(err);
})

app.use(express.static("./public"))

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/login.html")
})

app.get("/pokedex", function(req, res) {
    if (req.session.authenticated) {
        console.log("User Infoaaaaaaaaaaaaaaaaaaaaaaaa" + req.session.current_user)
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
            res.send("No user could be found, please try again.")
        }
        else {
            console.log("Found User Data" + found_user[0])
            if (req.body.password == found_user[0].password) {
                console.log("Correct username and password")
                req.session.authenticated = true
                req.session.current_user = found_user
                console.log(`Username: ${req.session.current_user[0].username} Password: ${req.session.current_user[0].password}`)
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
        shopping_cart: req.body.favourites,
        timeline: req.body.timeline
    })
    new_user.save(function(err, event) {
        if (err) {
            console.log("Err" + err)
            res.send("Username is unavailable, please choose again.")
        }
        else {
            console.log("Datajkhkjhkjhkjhkj" + event)
            req.session.authenticated = true
            req.session.current_user = [event]
            console.log(req.session.current_user[0].username)
            res.send("success")
        }
    })
})

app.get("/signOut", function(req, res) {
    req.session.authenticated = false
    res.send("Successfully signed out.")
})

app.get("/getUserInfo", function(req, res) {
    userModel.find({username: req.session.current_user[0].username}, function(err, user_info) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + user_info)
            res.send(user_info)
        }
    })
})

app.get("/timeline", function(req, res) {
    console.log(`Username: ${req.session.current_user[0].username} Password: ${req.session.current_user[0].password}`)
    // return back a json of all the docs in the timline collection
    userModel.find({username: req.session.current_user[0].username}, function(err, timeline) {
        if (err) {
            console.log("Err"+ err)
        }else {
            console.log("Data" + timeline)
            res.json(timeline[0])
        }
    })
})

app.post("/findEvent", function(req, res) {
    console.log(`Username: ${req.session.current_user[0].username} Password: ${req.session.current_user[0].password}`)
    // return back a json of all the docs in the timline collection
    userModel.find({username: req.session.current_user[0].username, timeline: {$elemMatch: {event: req.body.event}}}, {timeline: 1, _id: 0}, function(err, timeline) {
        if (err) {
            console.log("Err"+ err)
        }
        else {
            console.log("Data of user's timeline" + timeline[0])
            res.json([timeline, req.body.event])
        }
    })
})

app.post("/insertEvent", function(req, res) {
    console.log(`Username: ${req.session.current_user[0].username} Password: ${req.session.current_user[0].password}`)
    // request to insert a new doc in the timeline collection
    var timeline_event = new timelineModel({
        event: req.body.event,
        times: req.body.times,
        date: req.body.date
    })
    userModel.updateOne({username: req.session.current_user[0].username}, {$push: {timeline: timeline_event}}, function(err, user_event) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + user_event)
            res.send("Successful insertion!")
        }
    })
})

app.post("/updateEvent", function(req, res) {
    console.log(`Username: ${req.session.current_user[0].username} Password: ${req.session.current_user[0].password}`)
    console.log("time line event", req.body.event)
    criteria = {username: req.session.current_user[0].username}
    update = {$inc: {"timeline.$[el].times": 1}}
    filters = {arrayFilters: [{"el.event": req.body.event}]}
    userModel.findOneAndUpdate(criteria, update, filters, function(err, timeline_event) {
        if (err) {
            console.log("Err" + err)
            res.send("failed")
        }
        else {
            console.log("Data" + timeline_event)
            res.send("Successful update")
        }
    })
})

app.delete("/removeThisEvent", function(req, res) {
    console.log(`Username: ${req.session.current_user[0].username} Password: ${req.session.current_user[0].password}`)
    criteria = {username: req.session.current_user[0].username}
    removal = {$pull: {timeline: {event: req.body.event}}}
    extras = {multi: true}
    userModel.updateMany(criteria, removal, extras, function(err, this_deleted) {
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
    console.log(`Username: ${req.session.current_user[0].username} Password: ${req.session.current_user[0].password}`)
    criteria = {username: req.session.current_user[0].username}
    removal = {$pull: {timeline: {}}}
    extras = {multi: true}
    userModel.updateMany(criteria, removal, extras, function(err, all_deleted) {
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

app.get("/getShoppingCart", function(req, res) {
    console.log(`Username: ${req.session.current_user[0].username} Password: ${req.session.current_user[0].password}`)
    userModel.find({username: req.session.current_user[0].username}, {shopping_cart: 1, _id: 0}, function(err, whole_cart) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + whole_cart)
            res.json(whole_cart)
        }
    })
})

app.post("/addToCart", function(req, res) {
    console.log(`Username: ${req.session.current_user[0].username} Password: ${req.session.current_user[0].password}`)
    userModel.updateOne({username: req.session.current_user[0].username}, {$push: {shopping_cart: {name: req.body.pokemon_name, quantity: req.body.amount, price: req.body.price}}}, function(err, cart_item) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + cart_item)
            res.send(cart_item)
        }
    })
})

app.post("/updateCartItem", function(req, res) {
    criteria = {username: req.session.current_user[0].username}
    update = {$inc: {"shopping_cart.$[el].quantity": req.body.amount}}
    filters = {arrayFilters: [{"el.name": req.body.pokemon_name}]}
    userModel.findOneAndUpdate(criteria, update, filters, function(err, updated_card) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + updated_card)
            res.send(updated_card)
        }
    })
})

app.post("/addToOrders", function(req, res) {
    userModel.updateOne({username: req.session.current_user[0].username}, {$push: {orders: {order: req.body.order, date: req.body.date}}}, function(err, order) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + order)
            res.send("Success")
        }
    })
})

app.get("/getOrders", function(req, res) {
    userModel.find({username: req.session.current_user[0].username}, function(err, order_history) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + order_history)
            res.json(order_history)
        }
    })
})

app.delete("/clearCart", function(req, res) {
    userModel.updateOne({username: req.session.current_user[0].username}, {$pull: {shopping_cart: {}}}, function(err, empty_cart) {
        if (err) {
            console.log("Err" + err)
        }
        else {
            console.log("Data" + empty_cart)
            res.send("success")
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
    poke_id: Number, 
    types: [String],
    weight: Number, // in kg
    height: Number, // in kg
    base_stat_total: Number,
    official_artwork: String, // url for image
    stats: [Number],
    price: Number
})

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    // shopping_cart: [[Object]],
    shopping_cart: [{
        name: String,
        quantity: Number,
        price: Number
    }],
    timeline: [{
        event: String,
        times: Number,
        date: String
    }],
    orders: [Object]
})

const userModel = mongoose.model("users", userSchema)
const timelineModel = mongoose.model("timelinevents", timelineSchema); 
const pokemonModel = mongoose.model("pokemons", pokemonSchema)
