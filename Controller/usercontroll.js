import Usermodel from '../models/Usermodel.js'; 
import Doctormodel from '../models/Doctormodel.js'; 
import Bookingmodel from '../models/Bookingmodel.js'; 
import bcrypt from "bcrypt"; 
export const register=async(req,res,next)=>{ 
    try{ // User Registration
        const {name,email,password}=req.body; 
        if(!name||!email||!password){ 
            return res.status(422).json({msg:'Please Enter all the field Carefully'});
        } 
        if(password<6){ 
            return res.status(401).json({msg:'Please Enter the Password Correctly'});
        } 
        const existinguser=await Usermodel.findOne({email}); 
        if(existinguser){ 
            return res.status(201).json({msg:'User with this email Already Exist'});
        }
        const salt=await bcrypt.genSalt(10); 
        const hashpassword=await bcrypt.hash(req.body.password,salt);
        req.body.password=hashpassword;
        const user=new Usermodel(req.body); 
        await user.save();  
        return res.status(201).json({msg:'User Sucsessfully Registerd'})

    } 
    catch(err){ 
        return res.status(404).json({msg:'Internal Server Error'})
    }
}; 
// USER LOGIN SERVER 
export const login=async(req,res)=>{ 
    try{ 
        const{email,password}=req.body; 
        // Validate
        if(!email||!password){ // ALl fields are required
            return res.status(401).json({msg:'Please Enter all the Fields'});
        } 
        if(password.length()<6){ // password validation
            return res.status(401).json({msg:'Please Enter the Password Corectly'})
        }  
        const getuser=await Usermodel.findOne({email}) // User with this email exist or Not; 

        if(!getuser){ 
            return res.status(401).json({msg:'Invalid credentials'})
        } 
        // Password Comparison 
        const compare=await bcrypt.compare(password,getUser.password); 
        if(!compare){ 
            return res.status(401).json({msg:'Incorrect Password! 2 Attempts Left'}); 
        } 
          //Generate token
    const token = jwt.sign({ id: getUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
// Login Success 
  return res.status(201).json({token})  
        


    } 
    catch(err){ 
        return res.status(404).json({msg:'Internal Server Error Found  in the System Please Check again'})
    }
};
 
// Get User Info for protected Routes;  
export const GetUserInfo=async(req,res)=>{  
    try{
    const user=await Usermodel.findOne({_id:req.body.id}); 
    user.password=undefined; 
    if(!user){ 
        return res.status(401).json({msg:'User Not exist'})
    } 
    else{
        return res.status(201).json({msg:'User Successfully Fetched from the database',data:user})
    }
}
    catch(err){ 
        return res.status(404).json({msg:'Internal Server Errror Found'})
    }
}; 
// APPLY DOCTOR ACCOUNT ON THE APPLICATION 
export const applydoctor=async(req,res)=>{
    try{ 
        const Doctor=new Doctormodel(req.body); 
        await Doctor.save(); 
        const getAdmin=await Usermodel.findOne({isAdmin:true}); 
        const unSeennotification=getAdmin.unSeennotification
    } 
    
    catch(err){
        res.status(404).json({msg:'Internal Server Error in the System'})
    }
}

