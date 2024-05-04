import Doctormodel from './models/Doctormode.js'; 
import Usermodel from './models/Usermodel.js';  
// Get the users
export const getalluser=async(req,res,next)=>{  
    const username=req.body;
    try{  
        const users=await Usermodel.find({username:username}) 
        if(users){ 
            return res.status(200).json({data:users})
        }

    } 
    catch(err){ 
        return  res.status(404).json({msg:"Erron in the Server"})
    }
}; 
// Get all the Doctor 
export const getalltheDoctor=async(req,res,next)=>{  
    const username=req.body;    
    try{ 
        const Doctors=await Doctormodel.find({username:username}); 
        if(Doctors){ 
            return res.status(201).json({data:Doctors});
        }
    }
    catch(err){ 
        return res.status(501).json({msg:"Error in the Server"})
    }
};  
// update the Doctor  
export const changeaccountstatus=async(req,res,next)=>{  
    try{
    const{doctorID,status}=req.body; 
    const Doctor=await Doctormodel.findbyIdandUpdate(doctorID,{status}) 
    if(!Doctor){ 
        return res.status(201).json({msg:'Doctor Not Found in the Database'})
    } 
    const user=await Usermodel.findOne({_id: doctor.userId}); 
    if(!user){ 
        return res.status(201).json({msg:'User not found in the database'})
    } 
    const unseennotification=user.unseennotification; 
    unseennotification.push({ 
        type:"doctor account request has been updated",
        message:`Your Doctor account request has ${status}`,
        onclick:"./notification",
    });
    user.isDoctor=status==="aprooved"?true:false; 
    user.save(); 
    return res.status(201).json({msg:'Account Sucsessfully Updated'});
    }
    catch(err){  
        res.status(501).json({msg:'Account is still Pennding'});

    }
};


