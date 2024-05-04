import mongoose from "mongoose";
const UserModel=new mongoose.Schema({ 
 name:{ 
    type:String,  
    require:true,
 }, 
 email:{ 
    type:String, 
    unique:true,
 },  
 password:{ 
    type:String, 
    require:true, 
 }, 
 isDoctor:{ 
    type:Boolean,
    default:false,
 }, 
 isAdmin:{ 
    type:Boolean, 
    default:false,
 },
 seennotification:{ 
    type:Array,
    default:[],
 }, 
 unseennotification:{ 
    type:Array,
    default:[],

 },
}, 
{timestamp:true},
);
export default mongoose.model("User",UserModel)