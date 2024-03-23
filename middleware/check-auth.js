const jwt = require('jsonwebtoken')

module.exports= async (req, res, next) => {
    try{
        console.log(req.headers)
const token = req.headers.authorization.split(" ")[1]
if(token){
const decodedToken = jwt.verify(token,'SUPER_SECRET_KEY')
req.userData = {userId: decodedToken.id}
next()
}else{
    throw Error('User is unauthorized ')
}}catch(err){
    throw Error(err)
}
}