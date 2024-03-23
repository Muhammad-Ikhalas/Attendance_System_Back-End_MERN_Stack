
const User = require('../Models/User');
const Record = require('../Models/Record')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next) => {
    // console.log("pending... : ",req.body)
    const {name, email, password, isAdmin} = req.body;
    const user = await User.findOne({email : email})
    if(!user){
        try{
           const newUser = User({
            name: name,
            email: email,
            password: password,
            isAdmin: isAdmin
           }) 
           const createdUser = await newUser.save()
           return res.json({message : 'User signup successfully.', user : createdUser})
        }catch(error){
            res.json({message: error})
        }
    }else{
        return res.json({message: 'this email already exist.'})
    }
}
exports.signin = async(req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email : email})
    if(user){
        try{
            if (password === user.password){
const token = jwt.sign({id: user._id}, 'SUPER_SECRET_KEY'); 
                return res.json({message: "signin Successfull" , user: user, token: token})
           }else{
            return res.json({message: "You Entered wrong password"})
           }
        }catch(error){
           console.log(error) 
        }
    }else{
        return res.json({message: 'User with this email do not exist.'})
    }
}
exports.present = async (req, res)=>{
    const state = req.body;
    const newState = {...state, requestFor: "present" , createdBy:req.userData.userId}
    // console.log(newState)
    try{
        const student = await User.findById(newState.createdBy)
        const admin = await User.findOne({isAdmin: true})
        if(student){
            const request = new Record(newState);
            const newRequest = await request.save()
            student.requests.push(newRequest)
            await student.save()
            if(admin){
                admin.requests.push(newRequest)
                await admin.save()
            }
            return res.json({message : 'marked present.', request : newRequest})
        }
       
     }catch(error){
         res.json({message: error})
         console.log(error)
}}
exports.leave = async (req, res)=>{
    console.log("in leave")
    const state = req.body;
    const newState = {...state, requestFor: "leave", createdBy: req.userData.userId}
    try{
        const student = await User.findById(newState.createdBy)
        const admin = await User.findOne({isAdmin: true})
        if(student){
        const request = new Record(newState);
        const newRequest = await request.save()
        student.requests.push(newRequest)
        await student.save()
        if (admin){
            admin.requests.push(newRequest)
            await admin.save()
        }
        return res.json({message : 'leave marked.', request : newRequest})
     }}catch(error){
         return res.json({message: error})
}
}

exports.acceptRequest = async (req, res, next) => {
    console.log('rid:', req.params.id)
    const requestId = req.params.id;
    
    try{
    const request = await Record.findById(requestId)
    console.log('request',request)

    if(request){
        request.status= 'Approved'
        const updatedRequest = await request.save()
        const admin = await User.findOne({isAdmin: true})
        if(admin){
           const filteredRequests = admin.requests.filter((request) => {
            return request._id != requestId;
           })
           admin.requests = filteredRequests
           const updatedAdmin = await admin.save();
           res.json({message: 'Admin Approved', request: updatedRequest})
        }else{
            res.json({message: "couldn't get admin from database"})
        }
    }else{
        res.json({message: "couldn't get request from database"})
    }
}catch(err){
    console.log(err)
}
}

exports.rejectRequest = async (req, res, next) => {
    const requestId = req.params.id;
    try{
    const request = await Record.findById(requestId)
    const student = await User.findById(request.createdBy)
    if(request){
        request.status= 'Rejected'
        const updatedRequest = await request.save()
        const admin = await User.findOne({isAdmin: true})
        if(admin){
           const filteredRequests = admin.requests.filter((request) => {
            return request._id != requestId;
           })
           admin.requests = filteredRequests
           const updatedAdmin = await admin.save();
            filteredRequests = student.requests.filter(request => (
            request._id != requestId
           ))
           student.requests = filteredRequests;
           await student.save()
           res.json({message: 'request rejected', request : request})
        }else{
            res.json({message: "couldn't get admin from database"})
        }
    }else{
        res.json({message: "couldn't get request from database"})
    }
}catch(err){
    console.log(err)
}
}

exports.getStudentRequests = async (req, res, next) => {
    console.log('id:', req.params.id)
    //    const studentId = req.userData.userId;
    try{
    const studentId = req.params.id
const student = await User.findById(studentId).populate('requests')
if(student){
    res.json({message: 'student get successfully', student: student})
}}catch(err){
    console.log(err)
}
}

exports.getAdminRequests = async (req, res, next) => {
    const adminId = req.userData.userId;
User.findById(adminId)
.populate({
    path: "requests",
    populate:{
        path: "createdBy",
    },
}).then((admin) => {
if(admin){
 res.json({message: 'admin fetched successfully', admin: admin})
}
}).catch((err)=>{
    console.log(err);
})}
 