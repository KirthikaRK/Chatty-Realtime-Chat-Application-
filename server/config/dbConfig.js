const mongoose=require('mongoose');

//connection logic
mongoose.connect(process.env.CONN_STRING);

//connection state
const db = mongoose.connection;

//checking the db connections
db.on('connected',()=>{
    console.log('DB is connected !');
})

db.on('err',()=>{
    console.log('DB is not connected! some error happended');
})

module.exports=db;
