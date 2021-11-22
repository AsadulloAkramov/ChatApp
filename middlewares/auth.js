const jwt = require('jsonwebtoken');
const config = process.env;

 async function auth(req, res, next ){
  
    const token = req.cookies.jwt || req.headers["x-access-token"];
   

    if(!token)
    {
        return res.redirect('/api/users/signin');
    }

    try{
        let decoded = jwt.verify(token , config.TOKEN_KEY);
        next();
    }
    catch(err) {
        return res.status(400).send("Invalid Token");
    }
}


module.exports = auth;
