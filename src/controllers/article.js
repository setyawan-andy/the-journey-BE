const { article, user } = require("../../models");

exports.getArticles = async (req, res) => {
    try {
        let data = await article.findAll({
            // include: [
            //     {
            //         model: user,
            //         as: "user",
            //         attributes: {
            //             exclude: ["createdAt", "updatedAt", "password"],
            //         }
            //     }
            // ],
            attributes: {
                exclude: ["idUser"],
            },
        });

        //convert to json

        data = JSON.parse(JSON.stringify(data));

        //mapping data
        data = data.map((item) => {
            return {
                ...item,
                image: process.env.PATH_FILE + item.image
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
            message: "server error",
        });
    }
};

exports.getArticleUser = async (req, res) => {
    try {
        const { id } = req.params;
        let data = await article.findAll({
            where: {
                idUser: id, 
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    }
                }
            ],
            // attributes: {
            //     exclude: ["idUser"],
            // },
        });

        //convert to json

        data = JSON.parse(JSON.stringify(data));

        //mapping data
        data = data.map((item) => {
            return {
                ...item,
                image: process.env.PATH_FILE + item.image
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
            message: "server error",
        });
    }
};

exports.getArticle = async (req, res) => {
    try {
        const { id } = req.params;
        let data = await article.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        //convert into JSON
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

exports.addArticle = async (req, res) => {
    try {
        const data = req.body;
        let newArticle = await article.create({
            ...data,
            image: req.file.filename,
            idUser: req.user.id,
        });

        newArticle = JSON.parse(JSON.stringify(newArticle));
        res.send({
            status: "success",
            data: {
                ...newArticle,
                image: newArticle.image,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}

exports.editArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updateArticle = {
            ...data,
            idUser: req.user.id
        }

        await article.update(updateArticle, {
            where: {
                id,
            }
        });

        res.send({
            status: "success",
            data: {
                id,
                updateArticle,
                image: req?.file?.filename,
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "server error"
        });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        await article.destroy({
            where: {
                id,
            }
        });

        res.send({
            status: "success",
            data: {
                id,
            }
        })
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: `delete id: ${id} failed`
        })
    }
};