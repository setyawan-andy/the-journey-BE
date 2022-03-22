const express = require("express");


const router = express.Router();

//controllers
const { addUsers, getUsers, getuser } = require("../controllers/user");
const { register, login, checkAuth } = require("../controllers/auth");
const { addArticle, getArticles, getArticle, getArticleUser } = require("../controllers/article");
const { getProfile, addProfile } = require("../controllers/profile");
const { setMark, getAllMark, getMark } = require("../controllers/bookmark");



//middleware
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");


//route
//user operation
router.post("/user", addUsers);
router.get("/users", getUsers);
router.get("/user/:id", getuser);
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

//article operation
router.post("/addarticle", auth, uploadFile("image"), addArticle);
router.get("/articles", getArticles);
router.get("/article/:id", getArticle);
router.get("/article-user/:id", getArticleUser)

//profile
router.get("/profile", auth, getProfile);
router.post("/addProfile", auth, addProfile);

//bookmark
router.get("/mark/:idArticle", auth, setMark);
router.get("/marks/:id", auth, getAllMark);
router.get("/getmark/:idUser/:idArticle", auth, getMark);




module.exports = router;