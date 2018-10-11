var user = require("./user");

module.exports.userProfilesMap = userProfilesMap = new Map();

// counter for userID
var count = 1;

// UserProfile Object
module.exports.UserProfile = UserProfile = function(userID){
    this.userID = userID;
    this.name = user.getUser(userID).fName + " " + user.getUser(userID).lName;
    this.userItems = new Map(); 
    this.userItemsArray = [];
    userProfilesMap.set(count, this); 
    count++;
};

UserProfile.prototype.emptyProfile = function(){
    userProfilesMap.delete(this.userID);
    //may need to set some statuses of the items to available upon deletion
}

UserProfile.prototype.removeUserItem = function(item){
    this.userItems.delete(item.itemCode);
    return this;
}

UserProfile.prototype.getUserItems = function(){
    return this.userItems;
}




//returns a userProfile by code (userID) or a string that states it was not found
module.exports.getUserProfile = getUserProfile = function(userID){
    var result = userProfilesMap.get(userID);
    if(result == undefined){
        return "User with that ID not found.";
    }else{
     return result;
    }
}




