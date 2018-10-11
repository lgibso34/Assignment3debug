//setup express to use for routing
var express = require("express");
var router = express.Router();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var itemDB = require("../models/itemDB");
var User = require("../models/user");
var _ = require("underscore");



//for method="POST"
var bodyParser = require("body-parser"); 
var urlencodedParser = bodyParser.urlencoded({extended: false});




module.exports = function(app){

//used for sessions
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));


//middleware for sign in status
router.use(function(req, res, next){
    var userEmail = "";
    if(_.isUndefined(req.session.theUser)){
        userEmail = "Not signed in."
    }else{
        userEmail = req.session.theUser.email;
    }   
    console.log(userEmail); 
    console.log("THIS IS SOME MIDDLEWARE SENT TO EACH PAGE....");

    //saves the email to req.email and sends all pages without needing to pass it
    // in res.render as an object
    req.email = userEmail;
    res.locals.email = req.email;
    
    next();
});

app.use("/", router);


var code = 0;
var userItem;
var verify = function(req, res){
    code = parseInt(req.query.theItem) || 0;
    userItem = itemDB.getItem(code);
    if(code == 0){
             res.send("Item Code not found.");
        }
                
    if(Number.isInteger(code) && code > 0 && code <= itemDB.itemsMap.size){ 
        return true;
    }else{
        return false;
    }
}


//this variable is global so the profileItems can be passed if /profile is accessed more than once
// per session
var profileItems;
var currentProfile;
app.get("/profile", urlencodedParser, function(req, res){
    
    //when the sign in function is called this happens

    //if no user is signed in pick the first user in your DB
    if(_.isUndefined(req.session.theUser)){
        var user1 = User.getUser(1);
        req.session.currentProfile = user1.profile;
        currentProfile = req.session.currentProfile;
        req.session.theUser = user1;
        //userItems session does not transfer over to app.js for some reason
        //it is used in this app fine though and every other session item
        //works in app.js no problem
        req.session.userItems = user1.profile.userItems;       
        profileItems = req.session.userItems;        

        req.session.userItemsArray = currentProfile.userItemsArray;

        //console.log(profileItems);
        
    }



    // check if a user is signed in
    if(!_.isUndefined(req.session.theUser)){
        //save the action value if it is defined
        if(!_.isUndefined(req.query.action)){var action = req.query.action;}
        

        //SIGN OUT action
        if(action == "signout"){
            profileItems = undefined;
            currentProfile = undefined;
            req.session.theUser = undefined;
            res.redirect("categories");


        // sign in action
        }else if(action == "signin"){
            //no code because line 70 if(_.isUndefined(req.session.theUser)){ signs
            // in automatically if no one is signed in when they visit the profile page            
            res.redirect("index");
            
        //if a user is signed in do look for the parameter "action" and handle
        // it accordingly. otherwise the default case occurs. Also check that
        // theItem is a parameter and is defined.
        }else if(!_.isUndefined(action) && !_.isUndefined(req.query.theItem)){           
            
            switch(action){
                case "update":
                                
                if(verify(req, res)){  
                
                if(userItem.status === "PENDING"){
                    res.render("mySwaps", {userCars: profileItems});
                }else if(userItem.status === "AVAILABLE"){
                    res.render("swap", {car: userItem, userCars: profileItems});
                }else
                 {
                    res.render("404");
                 }
                }

                break;

                //trying to use fall through to my benefit  
                case "accept":   
                //http://localhost:3000/profile?theItem=1&action=accept             
                case "reject":                
                case "withdraw":
                             
                if(verify(req, res)){  
                    if(action === "withdraw" || action === "reject"){
                        userItem.changeStatus("AVAILABLE");
                    }else{
                        userItem.changeStatus("SWAPPED");
                    }
                    //req.session.sessionProfile = 
                    
                    res.render("myItems", {userCars: profileItems});                
                }else{
                    res.render("404");
                }
                break;
                case "offer":
                //offer action should come from the swap.ejs or item.ejs
                if(verify(req, res)){
                    var availableItems = [];
                    profileItems.array.forEach(function(item){
                        if(item.status === "AVAILABLE"){
                            availableItems.push(item);
                        }                        
                    });
                    if(_.isEmpty(availableItems)){
                        var message = "Sorry, you do not have any available items for swapping."
                        + " Please add more items to start swapping again!";
                        res.render(req.originalUrl, {message: message});
                    }else
                    {
                        res.redirect("swap", {});
                    }
                }
                break;
                case "delete":
                // deletes theItem from the usersItems and then saves the new
                // profile to the session
                //http://localhost:3000/profile?theItem=9&action=delete
                if(verify(req, res)){
                var newProfile = currentProfile.removeUserItem(userItem);
                console.log(newProfile);
                currentProfile = newProfile;
                profileItems = req.session.userItems = currentProfile.userItems;
                res.render("myItems", {userCars: profileItems}); 
                }else{
                    res.render("404");
                }
                break;
                
                default:
                //if no case matches just show the profile view
                //make a profile.ejs page????
                res.render("myItems", {userCars: profileItems});
            }
            
            
        }
    }else{
    res.redirect("index");
    }
    
});




}