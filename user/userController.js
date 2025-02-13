const userService = require("./userService");
  

exports.createUser = async(req,res) =>{
    try{
       const data = req.body;
       const { name, email, password, address, latitude, longitude } = data;
       if (!name || !email || !password || !address || !latitude || !longitude) {
        return res.status(400).send({
          status: false,
          message: "Missing required fields: name, email, password, address, latitude, or longitude."
        });
      }
       const newUser = await userService.createUser(data);

       res.status(200).send({
        status:true,
        message:"user created successfully",
        data:newUser
       })
    } catch(error){
        console.log("error while creating user:", error.message);

        res.status(500).send({
            status:false,
            message:"failed to create user"
        })
    }
}

exports.login = async(req,res) =>{
    try{
      const {email,password} = req.body;

      if(!email  || !password){
        return res.status(401).send({
             status:false,
             message:" email or password is missing"
        })
      }
      const token = await userService.userlogin(email,password);
       res.status(200).send({
        status:true,
        message:"user login successfully",
        data:token
       })

    } catch(error){
        console.log("error while login:",error.message)
        res.status(500).send({
            status:false,
            message:"failed to login user"
        })
    }
}


exports.toggleAllUsersStatus = async (req, res) => {
  try {
   
    const result = await userService.toggleAllUsersStatus();

    res.status(200).json({
      status: true,
      message: "All users' status has been toggled successfully",
    });
  } catch (error) {
    console.error("Error while toggling users' status:", error.message);
    res.status(500).json({
      status: false,
      message: "Failed to toggle users' status",
    });
  }
};

exports.getDistance = async (req, res) => {
  try {
    const distance = await userService.getDistance(req);

    // Send response with the calculated distance
    res.status(200).json({
      status_code: "200",
      message: "Distance calculation successful",
      distance: `${distance.toFixed(2)} km`  // Return distance in km
    });
  } catch (error) {
    console.error("Error calculating distance:", error.message);
    res.status(500).json({
      status_code: "500",
      message: "Failed to calculate distance"
    });
  }
};


exports.getUsersByWeekDays = async (req, res) => {
  try {
    const { week_number, page , limit } = req.body;
         
    if (!week_number || !Array.isArray(week_number)) {
      return res.status(400).send({
        status: false,
        message: "week_number must be an array of weekdays (0-6)"
      });
    }
    if (page < 1 || limit < 1) {
        return res.status(400).send({
          status: false,
          message: "Page and limit must be positive integers"
        });
      }

    const userGroups = await userService.getUsersByWeekDays(week_number, page, limit);

    res.status(200).send({
      status_code: "200",
      message: "Users retrieved successfully",
      data: userGroups
    });
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).send({
      status: false,
      message: "Failed to retrieve users"
    });
  }
};



