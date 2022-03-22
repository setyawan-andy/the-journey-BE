const { bookmark, article, user } = require("../../models");

exports.setMark = async (req, res) => {
    try {
        const { idArticle } = req.params;
        const dataExist = await bookmark.findOne({
            where: {
                idUser: req.user.id,
                idArticle,
            },
        });

        if(dataExist) {

            
            if(dataExist.isMark === 1 ){
                await bookmark.update( //destriy
                    { isMark: 0 },
                    { where: { idUser: req.user.id, idArticle } }
                );
            } else {
                await bookmark.update( //create
                    { isMark: 1 },
                    { where: { idUser: req.user.id, idArticle } }
                );
            }

            res.send({
                status: "success",
                message: "success update mark"
            });
        } else {
            await bookmark.create({
                idUser: req.user.id,
                idArticle,
                isMark: 1
            });

            res.send({
                status: "success",
                message: "success add bookmark"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
};

exports.getAllMark = async (req, res) => {
    try {
        const { id } = req.params;
        let data = await bookmark.findAll({
            where: { idUser: id, isMark: 1 },

            include: [
                {
                    model: article,
                    as: "article",
                    include: [
                        {
                            model: user,
                            as: "user",
                            attributes: {
                                exclude: [
                                    "id",
                                    "email",
                                    "password",
                                    "createdAt",
                                    "updatedAt",
                                ],
                            },
                        },
                    ],
                    attributes: { exclude: ["idUser", "updatedAt"] },
                },
            ],
            attributes: {
                exclude: ["idUser", "idArticle", "isMark", "updatedAt", "createdAt"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        data = data.map((item) => {
            return {
                ...item,
                image: process.env.PATH_FILE + item.article.image,
            };
        });
        
        res.send({
            status: "success",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "server error"
        });
    }
};

exports.getMark = async (req, res) => {
    try {
        const { idUser, idArticle } = req.params;

        const data = await bookmark.findOne({
            where: {
                idUser,
                idArticle,
            },
            attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
            },
        });

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