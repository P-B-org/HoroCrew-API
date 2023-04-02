const router = require("express").Router();

const authController = require("../controllers/auth.controller");

/* Auth */
router.post("/login", authController.login);

module.exports = router;
