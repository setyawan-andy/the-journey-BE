const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    //check if user send token via header
    if (!token){
        return res.status(401).send({
            message: "Access denied!",
        });
    }

    //if user has token, need to be verified
    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = verified;
        next(); // go to next request
    } catch (error) {
        //if token not verified
        res.status(400).send({
            message: "Invalid token!",
        });
    }
};