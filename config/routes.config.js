const router = require("express").Router();
const upload = require("../config/cloudinary.config");

const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/user.controller");
const postController = require("../controllers/post.controller");
const notificationController = require("../controllers/notifications.controller");

const authMiddleware = require("../middlewares/auth.middleware");

/* Auth */
router.post("/login", authController.login);
router.post("/signup", upload.single("image"), authController.signup);

/* User */
router.get("/users", authMiddleware.isAuthenticated, usersController.getUsers);
router.get(
  "/users/me",
  authMiddleware.isAuthenticated,
  usersController.getCurrentUser
);
router.get(
  "/users/:id",
  authMiddleware.isAuthenticated,
  usersController.getUser
);

/* Posts */
router.post("/post", authMiddleware.isAuthenticated, postController.newPost);
router.post(
  "/post/:id/delete",
  authMiddleware.isAuthenticated,
  postController.deletePost
);

/* Notifications */
router.post(
  "/users/:id/follow",
  authMiddleware.isAuthenticated,
  notificationController.follow
);

module.exports = router;
