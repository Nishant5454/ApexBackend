import mongoose from "mongoose"; 
const Doctorschema=new mongoose.model({ 
    userid:{ 
        type:String, 
        require:true,
    }, 
    userinfo:{ 
        type:String, 
        require:true,
    },
    firstname:{ 
       type:String, 
       require:true,
    }, 
    lastname:{ 
        type:String, 
        require:true,
    } ,  
    department:{ 
        type:String, 
        require:true,
    }, 
    specialization:{ 
        type:String, 
        require:true,
    }, 
    phonenumber:{ 
        type:Number, 
        require:true,

    }, 
    experience:{ 
        type:Number, 
        require:true,
    }, 
    fee:{ 
        type:Number, 
        require:true,
    }, 
    status:{ 
        type:String, 
        require:Number,
        default:"pending",
    }





    
}); 
export default mongoose.model('DoctorData',Doctorschema); 
