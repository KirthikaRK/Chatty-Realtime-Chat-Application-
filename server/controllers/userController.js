const router=require('express').Router();
const User=require('./../models/user');
const authMiddleware=require('./../middlewares/authMiddleware');

//GET details of the current logged in user. 

router.get('/get-logged-user',authMiddleware,async(req,res)=>{ //before this method gets executed we want this route to be accessible only to the valid users so we use authmiddleware. 
    
    try{
        const user=await User.findOne({_id:req.body.userId});
        res.send({
            message:'user fetched successfully!',
            success: true,
            data:user
        })
    }
    catch(error)
    {
        res.send({
            message:error.message,
            success:false
        })
    }
});

router.get('/get-all-users',authMiddleware, async (req,res)=>{
    try{
        const userid=req.body.userId;
        const allUsers=await User.find({_id:{$ne:userid}}); //$ne = its a mongoDB operator which implies not equal to. 
        res.send({
            message:'all users fetched successfully',
            success:true,
            data:allUsers
        })

    }
    catch(error)
    {
        res.send({
            message:error.message,
            success:false
        })
    }
})

module.exports=router;