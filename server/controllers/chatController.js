const router=require('express').Router();
const authMiddleware=require('./../middlewares/authMiddleware')
const Chat=require('./../models/chat');
const Message=require('./../models/message')

router.post('/create-new-chat',authMiddleware, async(req,res)=>{
    try{
        // we create a new chat, thus we need the user_Id of the two user
        const chat= new Chat(req.body);
        const savedChat=await chat.save();

        await savedChat.populate('members');
        
        res.status(201).send({
            message:'new chat created successfully',
            success: true,
            data: savedChat
        })
    }
    catch(error){
        res.status(400).send({
            message:'New Chat creation failed',
            success:false
        })
    }
})

router.get('/get-all-chats',authMiddleware,async(req,res)=>{

    try{
        //$in is a mongoDB operator used to perform the 'IN' operations. ie find IN an array whether the said element is present or not
        const allChats=await Chat.find({members:{$in: req.body.userId}}) 
                                 .populate('members')
                                 .populate('lastMessage')
                                 .sort({updatedAt:-1});
        res.status(200).send({
            message:'All chats displayed successfully',
            success:true,
            data:allChats
        })
    }
    catch(error){
        res.status(400).send({
            message:error.message,
            success:false
        })
    }
});

router.post('/clear-unread-message',authMiddleware,async(req,res)=>{
    try{
        const chatId=req.body.chatId;


        const chat=await Chat.findById(chatId);
        if(!chat)
        {
            return res.send({
                message:"No chat found with given chat Id",
                success:false  
            })
        }
        const updatedChat=await Chat.findByIdAndUpdate(
            chatId,
            { unreadMessageCount:0},
            {new:true}
        ).populate('members').populate('lastMessage');

        await Message.updateMany(
            {chatId:chatId,read:false},
            {read:true}
        )
        res.send({
            message:"unread message cleared successfully",
            success:true,
            data:updatedChat 

        })
    }
    catch(error){
        res.send({
            message:error.message,
            success:false
        })
    }
})
module.exports=router;