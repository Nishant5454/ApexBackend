import Usermodel from '../models/Usermodel.js'; 
import Doctormodel from '../models/Doctormodel.js'; 
import Bookingmodel from '../models/Bookingmodel.js'; 
import bcrypt from "bcrypt";  
import moment from "moment";
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
        unSeennotification.push({ 
            type:"New Application come for the Doctor Request",
            message:`${Doctor.first_name} ${Doctor.last_name} has applied for the Role of Docotr`,
            data:{ 
                doctorId:Doctor._Id, 
                name:Doctor.first_name+Doctor.last_name, 

            },
            onClickPath:"admin/doctors",
        }); 
        await Usermodel.findByIdAndUpdate(getAdmin._id,{unSeennotification}); 
        // Response from the Server 
        return res.status(201).json({msg:'Application Sucsessfully Submiited',});
    } 

    catch(err){
        res.status(404).json({msg:'Internal Server Error in the System'})
    }
};  
export const markAllNotificationsAsSeen = async (req, res, next) => {
    try {
      const user = await UserModel.findOne({ _id: req.body.userId });
      const unSeenNotifications = user.unSeenNotifications;
  
      //Append unSeenNotifications to seenNotifications array
      user.seenNotifications.push(...unSeenNotifications);
  
      //Clear unSeenNotifications array
      user.unSeenNotifications = [];
  
      //Save the Updated user
      const updatedUser = await user.save();
      updatedUser.password = undefined; //Password hide
      return res.status(200).json({
        success: true,
        message: "All notifications marked as seen!",
        data: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal Server Error!",
        success: false,
        error: err.message,
      });
    }
  };
  
  //************ DELETE ALL SEEN NOTIFICATIONS *******************/
  export const deleteAllSeenNotifications = async (req, res, next) => {
    try {
      const user = await UserModel.findOne({ _id: req.body.userId });
  
      //Clear the seenNotifications array
      user.seenNotifications = [];
  
      //Save the updated user
      const updatedUser = await user.save();
      updatedUser.password = undefined;
  
      return res.status(200).json({
        success: true,
        message: "All seen notifications deleted!",
        data: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error!",
        error: err.message,
      });
    }
  };
  
  //************** GET ALL APPROVED DOCTORS ***********/
  export const getAllApprovedDoctors = async (req, res) => {
    try {
      const doctors = await DoctorModel.find({ status: "approved" });
      if (!doctors) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found.",
        });
      }
  
      //success res
      return res.status(200).json({
        success: true,
        message: "Doctor list fetched successfully!",
        data: doctors,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error!",
        error: err.message,
      });
    }
  };
  
  //************** BOOK APPOINTMENTS ***********/
  export const bookingAppointment = async (req, res) => {
    try {
      //Get data
      let { doctorId, userId, doctorInfo, userInfo, date, time, status } =
        req.body;
      if (!date || !time) {
        return res.status(422).json({
          success: false,
          message: "Please select date and time!",
        });
      }
  
      //Change date and time to ISO String (Used for convert date object to string obj) for check availability
      date = moment(date, "DD-MM-YYYY").toISOString();
      time = moment(time, "HH:mm").toISOString();
      status = "pending";
  
      //Add bookings
      const newBookings = new BookingModel({
        doctorId,
        userId,
        doctorInfo,
        userInfo,
        date,
        time,
        status,
      });
      await newBookings.save();
  
      //Push notification to user
      const user = await UserModel.findOne({ _id: req.body.doctorInfo.userId });
      user.unSeenNotifications.push({
        type: "New-Booking-Request",
        message: `A new appointment booking request from ${req.body.userInfo.name}`,
        onClickPath: "/user/appointments",
      });
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Appointment booking successfully!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error!",
        error: err.message,
      });
    }
  };
  


