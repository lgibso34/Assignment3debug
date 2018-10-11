var item = require("./item");
var user = require("./user");
var userProfile = require("./userProfile");



module.exports.usersMap = usersMap = user.usersMap;
module.exports.itemsMap = itemsMap = item.itemsMap;
//module.exports.userProfileMap = userProfileMap = userProfile.userProfilesMap;

module.exports.populate = populate = function(){

var user1 = new user.User("Logan", "Gibson", "logan@logan.com", "1111 address lane","", "Harrisburg", "NC", 28075, "United States");
var user2 = new user.User("Bree", "Calloway", "bree@bree.com", "2222 address lane","", "Harrisburg", "NC", 28075, "United States");
var user3 = new user.User("Ryan", "Anderson", "ryan@ryan.com", "3333 address lane","", "Harrisburg", "NC", 28075, "United States");

//sets the checked out cars for user2
addCarsForUser(1,9);
addCarsForUser(1,2);

}

//adds cars to the userItems map which is a property of UserProfile
var addCarsForUser = function(userID, itemID){
    userProfile.getUserProfile(userID).userItems.set(itemsMap.get(itemID).itemCode, itemsMap.get(itemID));
    userProfile.getUserProfile(userID).userItemsArray.push(itemsMap.get(itemID));
}

//returns every user object that is currently in the usersMap from the user.js file
module.exports.getUsers = getUsers = function(){
    return usersMap;
};

module.exports.getUserProfile = getUserProfile = function(userID){
    return userProfile.getUserProfile(userID);
}

//must populate itemDB too!!!!!!!!!!!!!!!! for testing
//populate();
//itemDB.populate();
//console.log(usersMap);
//console.log(getUsers());
//console.log(userProfile.getUserProfile(3));
//console.log(getUserProfile(3));
//console.log(userProfile.getUserItems(2));
//console.log(user.getUser(1));
// var user1 = user.getUser(1);
// var user1profile = user1.profile;
// console.log(user1profile);
// console.log(user1profile.userItems);

//console.log(userProfile.emptyProfile(2));
//console.log(userProfilesMap);
