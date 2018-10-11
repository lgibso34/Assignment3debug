
var express = require("express");
var bodyParser = require("body-parser"); 
var urlencodedParser = bodyParser.urlencoded({extended: false});
var app = express();
var router = express.Router();
var _ = require("underscore");
var item = require("../models/item");
var itemDB = require("../models/itemDB");
var userDB = require("../models/userDb");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var profileController = require("./ProfileController");
itemDB.populate();
userDB.populate();

//npm init to create json file
//npm install express -save
//npm install ejs -save
//-save saves it to the json file as a dependency

//set the view engine to render ejs files
app.set("view engine", "ejs");
app.set('views', '../views');

//when localhost:3000/css is visited where should your app look for files from the location that app.js is located? in this case the css folder inside the resources folder
app.use("/css", express.static("../resources/css"));
app.use("/javascript", express.static("../resources/javascript"));
app.use("/images", express.static("../resources/images"));

profileController(app);


app.get("/", function(req, res){
    res.render("index");
});



app.route("/index")
.get(function(req, res){    res.render("index");    })
.post(function(req, res){   res.render("index");    });


app.get("/signin", function(req, res){  res.render("signIn");   });

app.get("/signup", function(req, res){  res.render("signUp");   });

app.get("/myItems", function(req, res){
    //grabs the users car items from
    var userCars = Array.from(userMap.values());
    res.render("myItems", {userCars: userCars});
});

app.get("/mySwaps", function(req, res){
    //grabs the users car items from
    var userCars = Array.from(userMap.values());
    res.render("mySwaps", {userCars: userCars});
});

app.get("/carhistory", function(req, res){  res.render("carHistory");   });

app.get("/cart", function(req, res){    res.render("cart");     });



app.route("/categories")
.get(urlencodedParser, function(req, res){
    if(_.isUndefined(req.session.theUser)){ 
        console.log("No user is signed in, displaying all cars.");      
    
    //grabs all cars in DB
    var cars = itemDB.getItems();
    //grab brand from FORM
    var brand = req.query.catalogCategory;
    //if no category is specified in the URL 
    if(_.isEmpty(req.query) || !item.categories.includes(brand)){
        //grab brand from URL        
        res.render("categories", {cars: cars, brand: brand});
    } else if(brand){
        //return only the items with the specified category
        var filtered = itemDB.getItemsByCategory(brand);
        res.render("categories", {cars: filtered, brand: brand});
    } else{
        res.render("404");
    }
    }else{
        //if a user is signed in these statements will execute
        console.log("User is signed in, displaying cars not belonging to " + req.email + ".");
        //get the items that the signed in user doesn't own, stores an array
        var userCars = itemDB.getItemsNotOwnedBy(req.session.currentProfile);
                
        //brand is required for the ejs page, brand will be undefined which is fine
        var brand = req.query.catalogCategory;
        //bool is used to tell the ejs page that the user is signed in
        var bool = true;
        res.render("categories", {cars: userCars, brand: brand, bool: bool});
    }
    
})

 //this will work when using method="POST" in the forms for sorting
.post(urlencodedParser, function(req, res){
    //grabs all cars in DB
    var cars = itemDB.getItems();
    //grab brand from FORM
    var brand = req.query.catalogCategory;
    //if no category is specified in the URL 
    if(_.isEmpty(req.query)){
        //grab brand from URL        
        res.render("categories", {cars: cars, brand: brand});
    } else{
        //return only the items with the specified category
        var filtered = itemDB.getItemsByCategory(brand);
        res.render("categories", {cars: filtered, brand: brand});
    }
});



app.route("/item")
.get(urlencodedParser, function(req, res){
    //shows what comes after the URL to the console
    //console.log(req.params.itemID);
    var cars = itemDB.getItems();
    if(_.isEmpty(req.query)){
        res.render("404");
    } else{
        var code = parseInt(req.query.itemCode)
        //validation that itemCode is between 1 and the size of the DB map
        if(Number.isInteger(code) && code > 0 && code <= itemDB.itemsMap.size){       
        var car = itemDB.getItem(code);
        res.render("item", {car: car, carList: cars});
        }
        else{
            res.redirect("categories");
        }
    }
})

//this will work when using method="POST" in the forms
.post(urlencodedParser, function(req, res){
    //shows what comes after the URL to the console
    //console.log(req.params.itemID);
    var cars = itemDB.getItems();
    if(_.isEmpty(req.body)){
        res.render("404");
    } else{
        var code = parseInt(req.query.itemCode)
        //validation that itemCode is between 1 and the size of the DB map
        if(Number.isInteger(code) && code > 0 && code <= itemDB.itemsMap.size){        
        var car = itemDB.getItem(parseInt(req.body.itemCode));
        res.render("item", {car: car});
        }
        else{
            res.redirect("categories");
        }
    }
});


//variable for the car that user wants to potentially swap with
//their inventory
var swapCar;
app.route("/swap")
.get(urlencodedParser, function(req, res){
    //?property1=example&property2=example
    //req.query = {property1: "example", property2: "example"}

    //shows what comes after the URL to the console
    //console.log(req.params.itemID);
    //var userCars = itemDB.userMap;

    //this works
    //var userCars = req.session.userItemsArray;
    var userCars = req.session.userItems;
    console.log(userCars);
    
   
    //var cars = itemDB.getItems();
    if(_.isEmpty(req.query)){
        res.render("404");
    } else{
        var code = parseInt(req.query.itemCode)
        //validation that itemCode is between 1 and the size of the DB map
        if(Number.isInteger(code) && code > 0 && code <= itemDB.itemsMap.size){       
        var car = itemDB.getItem(parseInt(req.query.itemCode));
        swapCar = car;
        res.render("swap", {car: car, userCars: userCars});
        }
        else{
            res.render("404");
        }
    }
})

.post(urlencodedParser, function(req, res){
    var userCars = req.session.userItems;
    //console.log(userCars + "IT WORKED");

    //var cars = itemDB.getItems();
    if(_.isEmpty(req.body)){
        console.log("empty");
        res.render("404");
    } else{
        var code = parseInt(req.body.itemCode)
        //validation that itemCode is between 1 and the size of the DB map
        if(Number.isInteger(code) && code > 0 && code <= itemDB.itemsMap.size){    
        userCars.delete(parseInt(req.body.itemCode));
        userCars.set(swapCar.itemCode, itemDB.getItem(parseInt(swapCar.itemCode)));
        
            
        var car = itemDB.getItem(parseInt(swapCar.itemCode));
        res.render("swap", {car: car, userCars: userCars});
        }
        else{
            console.log("else");
            res.render("404");
        }
    }
});

app.get("/subscribe", function(req, res){   res.render("subscribe");   });

app.get("/about", function(req, res){   res.render("about");   });

app.get("/contact", function(req, res){  res.render("contact");   });

app.get("/404", function(req, res){   res.render("404");   });

app.listen(3000);