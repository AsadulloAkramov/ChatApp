const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).render('/api/users/signin', {
            errorMessage: "Incorrect email or password"
        })
    }

    const user = await User.find({ email: req.body.email });
    if (!user) {
        return res.status(400).render('/api/users/signin', {
            errorMessage: "Incorrect email or password"
        })
    }

    // Check hash pasword with req password
    const isValidPassword = bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
        return res.status(400).render('/api/users/signin', {
            errorMessage: "Incorrect email or password"
        })
    }

    return res.status(200).redirect('/');

})

async function validate(req) {
    const schema = new Joi.object({
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().required().min(8).max(1024)
    });

    return schema.validate(req);
}
module.exports = router;