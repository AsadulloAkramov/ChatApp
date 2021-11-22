const jwt = require('jsonwebtoken');
const config = process.env;

 async function currentUser(req, res, next ){
  
    const token = req.cookies.jwt || req.headers["x-access-token"];
   
    if(token){
        // If there is a token we must check whether it is valid
        jwt.verify(token , config.TOKEN_KEY ,(err , decodedToken)=>{
            if(err){
                res.locals.user = null;
                console.log(err.message);
                next();
            }
            else {
              
                res.locals.user = decodedToken.username;
                next();
            }
        })
    }

    else {
        res.locals.user = null;
        next();
    }
}


module.exports = currentUser;
