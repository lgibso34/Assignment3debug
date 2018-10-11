var item = require("./item");
var _ = require("underscore");

//holds an array of items
var itemDB = item.itemsArray;

module.exports.itemsMap = itemsMap = item.itemsMap;
module.exports.userMap = userMap = new Map();
module.exports.populate = populate = function(){

var acura = new item.Item("2019 Acura TLX A-Spec SH-AWD", "Acura", "Luxury sedan sports car", "****", "../images/tlx.jpg");
var acura2 = new item.Item("2019 Acura NSX", "Acura", "Luxury sports car", "******", "../images/nsx.jpg");
var acura3 = new item.Item("2019 Acura RLX SH-AWD", "Acura", "Luxury sedan.", "*****", "../images/rlx.jpg");

var volvo = new item.Item("2019 Volvo S60 AWD", "Volvo", "Luxury sedan", "*****", "../images/s60.jpeg");
var volvo2 = new item.Item("2019 Volvo S90", "Volvo", "Luxury SUV", "*****", "../images/s90.jpg");
var volvo3 = new item.Item("2019 Volvo XC90 T8 Twin Engine Electric-AWD", "Volvo", "Luxury SUV", "*****", "../images/xc90.jpg");

var ferrari = new item.Item("2019 Ferrari 812 Superfast V12", "Ferrari", "this is a ferrari", "*****", "../images/812superfast.webp");
var ferrari2 = new item.Item("2019 Ferrari 488 GTB", "Ferrari", "this is a ferrari", "*****", "../images/488gtb.webp");
var ferrari3 = new item.Item("2019 Ferrari 488 Spider", "Ferrari", "this is a ferrari", "*****", "../images/488spider.webp");

//sets the checked out cars for the current user logged in
userMap.set(itemsMap.get(6).itemCode, itemsMap.get(6));
userMap.set(itemsMap.get(2).itemCode, itemsMap.get(2));
//item.changeStatus(itemsMap.get(6), "available");
}

//returns every item object that is currently in the itemsMap from the item.js file
module.exports.getItems = getItems = function(){
    return item.itemsMap;
};

//returns items in a formatted manner
module.exports.getItemsFormatted = getItemsFormatted = function(){
    var str = "";
    for(var i=1; i<itemsMap.size+1; i++){
        var element = getItem(i);
        str += printItem(element.itemCode) + "\n\n";
    };
    return str;
};

//returns an item by code (itemID) or a string that states it was not found
module.exports.getItem = getItem = function(itemID){
    var result = itemsMap.get(itemID);
    if(result == undefined){
        return "Element with that ID not found." ;
    }else{
     return result;
    }

}

module.exports.getItemsByCategory = getItemsByCategory = function(category){
    var result = itemDB.filter(x => x.catalogCategory === category);
    if(result == undefined){
        return "Element with that category not found."
    }
    else{
        return result;
    }
};

//pass the profile object
// creates an array of cars that do not belong to the user signed in
module.exports.getItemsNotOwnedBy = getItemsNotOwnedBy = function(userProfile){
    var result = [];
    var arr = userProfile.userItemsArray;
    //console.log(arr);
    for(var i=0; i<arr.length; i++){
        if(i<1){
        result = itemDB.filter(x => x.itemCode != arr[i].itemCode);
        }else{
            result = result.filter(x => x.itemCode != arr[i].itemCode);
        }
    }

    if(result == undefined){
        return "No other items found."
    }
    else{
        return result;
    }
};


// prints item in a formatted manner by ID
module.exports.printItem = printItem = function(ID){
    var e1 = getItem(ID);
    return "Name: " + e1.itemName + "\nItem ID: " + e1.itemCode + "\nBrand: " + e1.catalogCategory 
    + "\nDescription: " + e1.description + "\nRating: " + e1.rating;
};

//console.log("\n");
// returns the array of items in the array

// console.log(getItemsFormatted());
// console.log(getItem(0));
// console.log(item.getItemID(volvo));
// item.changeID(acura, 55);
// console.log(acura.itemCode);
// console.log(printItem(2));
// console.log(itemsMap);
// populate();
// console.log(getItems());
// console.log(getItem(1));

//console.log(getItemsByCategory("Acura"));

//console.log(item.categories);
//console.log("\n");