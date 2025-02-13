 const express = require("express")
 const bodyParesr = require("body-parser")
 const db = require("./db")
 const userRoutes = require("./user/userRoutes")
 const app = express();
 app.use(bodyParesr.json())
 app.use(bodyParesr.urlencoded({extended:true}))
 app.use('/user',userRoutes)
  app.listen(3001,()=>{
       console.log("server listening on port 3000")
  })