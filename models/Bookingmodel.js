import mongoose from "mongoose"; 
const bookingmodel= new mongoose.Schema({  
    userID:{ 
        type:String,
        require:true,

    },
    userInfo:{ 
        type:String, 
        require:true,
    },
    doctorID:{ 
        type:String, 
        require:true, 

    },
    doctorInfo:{ 
        type:String, 
        require:true,
    }, 
    date:{ 
        type:String, 
        required:true,
    }, 
    status:{ 
        type:String, 
        require:true,
    }, 
    time:{ 
        type:String, 
        require:true, 

    }, 
},
{timestamp:true}
); 
export default mongoose.model('Booking',bookingmodel);
