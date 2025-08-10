const router=require('express').Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User = require('./../models/user');



router.post('/signup', async(req,res)=>{
    //res.send('User created successfully!');
    try{
        //1. check if the user already exists or not
        const user=await User.findOne({email:req.body.email})

        //2. if user exists, send an error response
        if(user)
        {
            return res.status(400).send({
                message:'user already exists!',
                success: false
            })
        }

        //3. encrypt the password
        const hashedPassword=await bcrypt.hash(req.body.password,10);
        req.body.password=hashedPassword;

        //4. create new user and save in DB
        const newUser= new User(req.body);
        await newUser.save();

        res.status(201).send({
            message: 'New user created successfully!',
            success: true
        })

    }catch(error){
        res.send({
            message:error.message,
            success: false
        });
    }
})

router.post('/login',async(req,res)=>{
   // res.send('User logged in!');
    try{
        //1. check if the user exists in db or not
        const user=await User.findOne({email:req.body.email})
        if(!user)
        {
            return res.status(400).send({
                message:'User does not exist!',
                success:false
            })
        }

        //2. if the user exists check if the password given is valid or not
        const isValid=await bcrypt.compare(req.body.password,user.password);
        if(!isValid)
        {
            return res.status(400).send({
                message: 'Password is not valid',
                success: false
            })
        }

        //3. if the user exist and pwd is correct, assign a JWT(json pwd token) i.e., we gonna AUTHENTICATE THE USER for which we gonna create Authentication token and send that token in the response
        if (!process.env.SECRET_KEY) {
            res.send({
                message:"JWT_SECRET is missing in environment variables",
                success:false

        });
        }
        const token=jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});
       
        res.send({
            message: 'User loggedIn successfully',
            success: true,
            token: token
        })



    }
    catch(error){
        res.status(400).send({
            message:error.message,
            success:false
        });

    }



});


module.exports=router;