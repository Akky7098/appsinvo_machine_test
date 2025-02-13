  const mongoose = require("mongoose");


  mongoose.connect('mongodb+srv://ankitsin:Ankitsin0@cluster0.jmaqr.mongodb.net/',{}).then(()=>{
     console.log("database connected successfully")
  }).catch((err)=>{
     console.log("failed to connect with database",err.message)
  })
  // dbpass:CGdLgwFS1IefM6Ud