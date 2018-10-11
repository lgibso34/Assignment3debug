var user = require("./user");
var item = require("./item");

// counter for userID
var count = 1;
module.exports.usersSwaps = usersSwaps = new Map();

// UserSwap Object
module.exports.UserSwap = UserSwap = function(userItem, swapItem, swapItemRating, swapperRating){
    this.userItem = userItem;
    //grab the item from the database
    this.rating = userItem.rating;
    //available, pending(offer made), swapped(offer accepted)
    this.status = userItem.status;

    if(this.status === "AVAILABLE"){
    //the item swapped for this item
    this.swapItem = null;
    this.swapItemRating = null;
    //the swappers rating for the item
    this.swapperRating = null;    
    }else{
    //the item swapped for this item
    this.swapItem = swapItem;
    this.swapItemRating = swapItemRating;
    //the swappers rating for the item
    this.swapperRating = swapperRating; 
    }



    //add this user to the usersArray
    //addUser(this);
    usersSwaps.set(count, this);
    count++;
};

// adds user to the array
var addUser = function(item){
    usersArray.push(item);
};

//call item.changeStatus(item, "pending");