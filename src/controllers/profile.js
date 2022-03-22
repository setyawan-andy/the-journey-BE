const { profile } = require("../../models");

exports.getProfile = async (req, res) => {
    try {
        const idUser = req.user.id;

        let data = await profile.findOne({
            where : {
                idUser,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        data = {
            ...data,
            image: process.env.PATH_FILE + data.image,
        };

        res.send({
            status: "success",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "server error",
        });
    }
};

exports.addProfile = async (req, res) => {
    try {
        let newProfile = await profile.create({
            address: req.body.address,
            idUser: req.user.id,
            image: req.file.filename,
        })
        newProfile = JSON.parse(JSON.stringify(newProfile));

        res.send({
            status: "success",
            data: {
                ...newProfile,
                image: newProfile.image,
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "server error",
        });
    }
};