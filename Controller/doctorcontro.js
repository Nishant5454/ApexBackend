import Bookingmodel from '../models/Bookingmodel.js'; 
import Doctormodel from '../models/Doctormodel.js'; 
import Usermodel from '../models/Usermodel.js';   
export const getdoctorinformation=async(req,res)=>{  
    try{ 
        const doctor=await Doctormodel.findOne({userId:req.body.userId})
            if(!doctor){
                return res.status(201).json({msg:'Doctor Not Found int the Database'})
            } 
            else{ 
                return res.status(201).json({data:doctor});
            }
        } 
        catch(err){
            return res.status(404).json({msg:'Error in the server'})
        }
    }; 
    export const updateDoctorProfile=async(req,res)=>{
        try{
            const  doctor=await Doctormodel.findOneAndUpdate({
                userId:req.body.userId,
            },
            req.body); 
            if(!doctor){
                return res.status(201).json({msg:'Doctor Not Found in the DB'});
            } 
            else{ 
                return res.status(201).json({msg:'Doctor Data Updated',data:doctor})
            }
            } 
            catch(err){
                return res.status(404).json({msg:'Error in the Backend Server'})
            }
        }; 
        // Get Doctor  Appointment;
        export const getDoctorappointment=async (req,res)=>{ 
            try{
                const doctor=await Doctormodel.findOne({userId:req.body.Id}); 
                if(!doctor){
                    return res.status(301).json({msg:'Doctor Not Found'});
                } 
                const doctorAppointment=await Bookingmodel.findOne({
                    doctorID:doctor_Id,
                }) 
                .populate("doctorinfo")
                .populate("userinfo"); 
                if(!doctorAppointment||doctorAppointment.length()==0){
                    return res.status(404).json({msg:'Doctor Appointment Not Found'});
                }
                return res.status(201).json({data:doctorAppointment})
            } 
            catch(err){ 
                return res.status()
            }
        };
        export const updateAppointmentstatus=async(req,res)=>{ 
            try{ 
                const{appointmentId,status}=req.body;
                const appointments=await Bookingmodel.findByIdAndUpdate(appointmentId,{ 
                    status,
                }); 
                if(!appointments){ 
                    return res.status(404).json({msg:'Docotor Not Found  the Database'});
                }
                const user = await UserModel.findOne({ _id: appointments.userId });
                const unSeenNotifications = user.unSeenNotifications;
                unSeenNotifications.push({
                  type: "status-updated",
                  message: `Your Appointment has been ${status}`,
                  onClickPath: "doctor-appointments",
                });
                await user.save();
            
                //Success
                return res.status(200).json({
                  success: true,
                  message: "Appointment status updated!",
                });

            }
            catch(err){
                return res.status(404).json({msg:'Internal Server Error Found '})
            }

        };