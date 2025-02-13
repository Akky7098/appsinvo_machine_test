const userModel = require("./userModel");
const bcrypt = require("bcrypt");
 const auth = require("../config/auth")
  const jwt = require("jsonwebtoken");
const UserModel = require("./userModel");
const jwt_secret = 'abc123'

exports.createUser = async(data)=>{
      try{
        const { password } = data;
       const salt = await bcrypt.genSalt(10);

       const hashPassword = await bcrypt.hash(password,salt);

          data.password = hashPassword
          
          const newUser = await userModel.create(data);

          return newUser;
     }catch(error){
         console.log("issue in creating user:",error.message);
         throw error;
     }
}

  exports.userlogin  = async(email,password)=>{
   try{
          const user = await userModel.findOne({email});

           if(!user){
             throw new Error(" user not found");
           }

           const checkPassword = bcrypt.compare(password,user.password);

           if(!checkPassword){
             throw new Error("password does not match or invalid password")
           };

           const payload = {
             id:user._id,
             latitude: user.latitude,  
             longitude: user.longitude
           }

           const token = jwt.sign(payload,jwt_secret,{expiresIn:"1h"});

           console.log(token)

           return token;
  }
   catch(error){
       console.log("error in login user:",error.message)
       throw error;
   }
 }


 exports.toggleAllUsersStatus = async () => {
   try {
    
     const result = await userModel.updateMany(
       {},  
       [
         {
           $set: {
             status: {
               $cond: {
                 if: { $eq: ["$status", "active"] }, 
                 then: "inactive", 
                 else: "active",  
               },
             },
           },
         },
       ]
     );
 
     return result;  
   } catch (error) {
     console.log("Error in toggling users' statuses:", error.message);
     throw error;
   }
 };



function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; 
  return distance;
}


exports.getDistance = async (req) => {
  const { Destination_Latitude, Destination_Longitude } = req.body;

     const userLat = req.userLat
     const userLon = req.userLon
  
  const distance = calculateDistance(userLat, userLon, Destination_Latitude, Destination_Longitude);
  
  return distance;
};


const getDayOfWeek = (date) => {
  const day = new Date(date).getDay(); 
  return day;
};

exports.getUsersByWeekDays = async (week_numbers,page, limit ) => {
  try {
    const userGroups = {};
    const skip = (page - 1) * limit;
    console.log(skip)
    for (const dayIndex of week_numbers) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - dayStart.getDay() + dayIndex); // Get start of that day
      dayStart.setHours(0, 0, 0, 0); // Reset to midnight

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1); 

      const users = await UserModel.find({
        createdAt: { $gte: dayStart, $lt: dayEnd }
      })
      .skip(skip) 
      .limit(limit)

      const dayName = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][dayIndex];
      userGroups[dayName] = users.map(user => ({
        name: user.name,
        email: user.email
      }));
    }

    return userGroups;
  } catch (error) {
    console.error("Error retrieving users by weekdays:", error);
    throw new Error("Failed to retrieve users by weekdays");
  }
};

