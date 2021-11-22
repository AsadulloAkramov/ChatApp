const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {User , validate} = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const auth = require('../middlewares/auth');
router.get('/signup' , async(req, res)=>{
    res.render('users/signup')
    
})

router.get('/signin' , async(req, res)=>{
    res.render('users/signin')
})

router.get('/logout' ,(req, res , next)=>{
    res.cookie('jwt' ,'',{maxAge:1});
    res.redirect('/');
})

router.get('/me' ,async(req, res)=>{
    let decoded = jwt.verify(req.query.token , process.env.TOKEN_KEY);
    const user = decoded;
    console.log(user);  
    res.render('users/profile' , {
        user:user
    })
})

router.get('/chat', auth , (req, res)=>{
    res.render('users/chat')
})

router.post('/signup' , async (req, res , next)=>{

     try{
        // Validate user input with Joi
      const {error} = validate(req.body);
      if(error){
          const errorMessage = error.details[0].message;
          return res.status(400).render('users/signup' ,{
              errorMessage: errorMessage
          })
      }
     // Validate if the user already exists
     const userEmail = req.body.email;
     const ExistUser = await User.findOne({email:userEmail});
     
     if(ExistUser)
     {
        return res.status(400).render('users/signup' ,{
            errorMessage: "This email has beeen already registreted"
        })
     }
     
     const salt  = await bcrypt.genSalt();
     //Encrypt the password
     const encryptedPassword = await bcrypt.hash(req.body.password ,  salt);
       // Save a user in our database

       const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:encryptedPassword
    });  
     await user.save();   

     return res.redirect('/');
     
         next();  
     }

     catch{
            return res.status(400).render('users/signup');
            next();
     }
        
})

router.post('/signin' , async (req, res , next)=>{
      
    try{
         const {email , password} = req.body;

        //Validate if the user exists.
        const user = await User.findOne({email:email});
            console.log(user);

            const isValid = await bcrypt.compare(password , user.password );
            // console.log(isValid);
        //Verify user password against the password we saved earlier in our database.
        if(user && isValid){
           
            //And finally, create a signed JWT token.
               const token = jwt.sign({
                   _id:user._id ,
                   email:user.email ,
                   username:user.username
               } , process.env.TOKEN_KEY);
               
               console.log(token);
               res.cookie('jwt' , token ,{httpOnly:true});
               
               user.token = token;
               return res.redirect(`me/?token=${token}`);
        }
        else {       
           return res.render('users/signin');
        }   
    }
    catch{
        
        return res.render('users/signin');
    }
})


module.exports = router;