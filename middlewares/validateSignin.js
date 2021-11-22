

const Joi = require('joi');

function validateSignin(user){
   const schema = new Joi.object({
       email:Joi.string().required().min(5).max(50),
       password:Joi.string().required().min(8).max(1024)
   })

   return schema.validate(user);
}

module.exports.validateSignin = validateSignin;