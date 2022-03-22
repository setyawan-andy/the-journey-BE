//import model
const { user } = require("../../models");

//import joi validation
const Joi = require("joi");
//import bcrypt
const bcrypt = require("bcrypt");
//import jsonwebtoken
const jwt = require("jsonwebtoken");


//register function
exports.register = async (req, res) => {
    //joi schema validation
    const schema = Joi.object({
        fullName: Joi.string().min(5).required(),
        email: Joi.string().email().min(7).required(),
        password: Joi.string().min(5).required(),
        phone: Joi.string().min(10).required(),
    });

    //do validation and get object
    const { error } = schema.validate(req.body);

    //if error exist
    if (error) {
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });
    }

    //if no error in joi
    try {
        //generate salt
        const salt = await bcrypt.genSalt(10);
        //hashing pwd
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await user.create({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
        });

        //generate token
        const token = jwt.sign({id: user.id}, process.env.TOKEN_KEY);

        //result
        res.status(200).send({
            status: "success",
            data: {
                fullName: newUser.fullName,
                email: newUser.email,
                token,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
};

exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().min(7).required(),
        password: Joi.string().min(5).required(),
    });

    const { error } = schema.validate(req.body);

    if(error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            }
        });
    

    try {
        const userExist = await user.findOne({
            where: {
                email: req.body.email,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        if(!userExist)
            return res.status(400).send({
                status: "Failed",
                message: "user not found",
            });

        const isValid = await bcrypt.compare(req.body.password, userExist.password);

        if(!isValid){
            return res.status(400).send({
                status: "failed",
                message: "credential is invalid",
            });
        }

        const token = jwt.sign({id: userExist.id}, process.env.TOKEN_KEY);

        res.status(200).send({
            status: "success",
            data: {
                id: userExist.id,
                fullName: userExist.fullName,
                email: userExist.email,
                phone: userExist.phone,
                token,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });   
    }
};

exports.checkAuth = async (req, res) => {
    try {
        const id = req.user.id;

        const dataUser = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        if(!dataUser) {
            return res.status(404).send({
                status: "failed",
            });
        }

        res.send({
            status: "success",
            data: {
                user: {
                    id: dataUser.id,
                    fullName: dataUser.fullName,
                    email: dataUser.email,
                    phone: dataUser.phone,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.status({
            status: "failed",
            message: "server error",
        });
    }
};