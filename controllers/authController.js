const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


//register

const registerUser = async(req,res)=>{
    try{
        const {name, email, password, role} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const existingUser =
        await User.findOne({ email });

        if (existingUser) {
           return res.status(400).json({
            message: "User already exists",
             });
             }

      
           //hash password
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(password, salt);

           //create user

           

           const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role: role || "user"
           });

          
           res.status(201).json({
            message:"Register success",
            _id: user._id,
            name: user.name,
            email:user.email,
            role: user.role,
           
           });

        }  catch(error){
            res.status(500).json({
                message: "Registration Failed",
                error:error.message
            });
        }
    };


//Login
const loginUser = async(req,res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({message: "Email and Password are required"});
        }
        //check user
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
             return res.status(404).json({message: "Wrong Password Entered"});
        }

         //token Generate
           const token = jwt.sign(
            {id: user._id, role: user.role, },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
           );


          res.json({
            message: "Login Success",
             token,
              user: { 
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
         });


    } catch(error){
        res.status(500).json({message: "Login Failed",
            error:error.message
        });
    }
};



//Protect Dashboard

const dashboard = async (req, res) => {

  try {

    // USER DASHBOARD
    if (req.user.role === "user") {

      return res.json({
        message: "Welcome User Dashboard",
        user: req.user,
      });

    }


    // Seller Dashboard
    if (req.user.role === "seller") {

      return res.json({
        message: "Welcome Seller Dashboard",
        user: req.user,
      });

    }


    // Admin Dashboard
    if (req.user.role === "admin") {

      return res.json({
        message: "Welcome Admin Dashboard",
        user: req.user,
      });

    }


    // Invalid Role
    res.status(403).json({
      message: "Invalid role",
    });

  } catch (error) {

    res.status(500).json({
      message: "Error",
      error: error.message,
    });

  }
};

module.exports = {registerUser, loginUser, dashboard };