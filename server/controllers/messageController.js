const route=require('express').Router();
const authMiddleware=require('./../middlewares/authMiddleware');
const Chat=require('./../models/chat');
const Message=require('./../models/message');

route.post('/new-message',authMiddleware,async (req,res)=>{
    try{
        //store the message in message collection
        const newMessage=new Message(req.body);
       const savedMessage= await newMessage.save();
        //update the lastMessage in chat collection
            //const currentChat=await Chat.findById(req.body.chatId);
            //currentChat.lastMessage=savedMessage._id;
            //await currentChat.save();
         //Another simpler way to write the above LOC #19,#20,#21 is given below
            const currentChat=await Chat.findOneAndUpdate({
                _id:req.body.chatId
            },{
                lastMessage:savedMessage._id,
                $inc:{unreadMessageCount:1}     // '$inc' is a MongoDB operater to increase the value by 1.
            });

        res.status(201).send({
            message:'Message sent successfully',
            success: true,
            data:savedMessage
        })
    }
    catch(error){
        res.status(400).send({
            message:error.message,
            success:false
        })
    }
});

route.get('/get-all-messages/:chatId',authMiddleware,async(req,res)=>{
    try{
        const allMessages=await Message.find({chatId:req.params.chatId}).sort({createdAt:1}); //sort() func is used to sort hte message as per the order inwhich it was created and '1' denote we need it to be sorted in Ascending order

        res.send({
            message:'Message fetched successfully',
            success:true,
            data: allMessages
        })

    }
    catch(error)
    {
        res.status(400).send({
            message:error.message,
            success: false
        })
    }
});


module.exports=route;