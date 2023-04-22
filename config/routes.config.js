const router = require("express").Router();
const upload = require("../config/cloudinary.config");

const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/user.controller");
const postsController = require("../controllers/post.controller");
const followController = require("../controllers/follow.controller");
const notificationController = require("../controllers/notifications.controller");
const messagesController = require("../controllers/messages.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require("../middlewares/user.middleware");

/* Auth */
router.post("/signup", upload.single("image"), authController.signup);
router.post("/login", authController.login);
router.post(
  "/users/me/edit",
  authMiddleware.isAuthenticated,
  usersController.editProfile
);

/* User */

//GET USERS (CURRENT AND BY ID PARAMS)
router.get(
  "/users",
  authMiddleware.isAuthenticated,
  userMiddleware.addCurrentUserToReq,
  usersController.getUsers
);
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

//GET CURRENT USER POSTS
router.get(
  "/users/me/posts",
  authMiddleware.isAuthenticated,
  usersController.getCurrentUserPosts
);

//GET USER POSTS
router.get(
  "/users/:id/posts",
  authMiddleware.isAuthenticated,
  usersController.getUserPosts
);

//GET CURRENT USER LIKES
router.get(
  "/users/me/likes",
  authMiddleware.isAuthenticated,
  usersController.getCurrentUserLikes
);

//GET USER LIKES
router.get(
  "/users/:id/likes",
  authMiddleware.isAuthenticated,
  usersController.getUserLikes
);

/* Posts */

//GET ALL POSTS
router.get("/posts", authMiddleware.isAuthenticated, postsController.getPosts);

//GET POST LIKES
router.get(
  "/posts/:id/likes",
  authMiddleware.isAuthenticated,
  postsController.getPostLikes
);

//GET POST COMMENTS
router.get(
  "/posts/:id/comments",
  authMiddleware.isAuthenticated,
  postsController.getPostComments
);

//CREATE POST
router.post(
  "/posts/create",
  authMiddleware.isAuthenticated,
  upload.any(),
  postsController.newPost
);

//GET POST WITH COMMENTS
router.get(
  "/posts/:id",
  authMiddleware.isAuthenticated,
  postsController.postWithComments
);

//DELETE POST
router.post(
  "/posts/:id/delete",
  authMiddleware.isAuthenticated,
  postsController.deletePost
);

//LIKE POST
router.post(
  "/posts/:id/like",
  authMiddleware.isAuthenticated,
  postsController.likePost
);

//COMMENT POST
router.post(
  "/posts/:id/comment",
  authMiddleware.isAuthenticated,
  postsController.commentPost
);

//DELETE COMMENT
router.post(
  "/posts/comment/:id/delete",
  authMiddleware.isAuthenticated,
  postsController.deleteComment
);

/* Follows */

//CREATE FOLLOW
router.post(
  "/users/:id/follow",
  authMiddleware.isAuthenticated,
  followController.follow
);

//GET CURRENT USER FOLLOWERS
router.get(
  "/users/me/followers",
  authMiddleware.isAuthenticated,
  followController.getCurrentUserFollowers
);

//GET CURRENT USER FOLLOWEDS
router.get(
  "/users/me/followeds",
  authMiddleware.isAuthenticated,
  followController.getCurrentUserFolloweds
);

//GET USER FOLLOWERS
router.get(
  "/users/:id/followers",
  authMiddleware.isAuthenticated,
  followController.getUserFollowers
);

//GET USER FOLLOWEDS
router.get(
  "/users/:id/followeds",
  authMiddleware.isAuthenticated,
  followController.getUserFolloweds
);

/* Messages */

//CREATE MESSAGE
router.post(
  "/messages/:id/create",
  authMiddleware.isAuthenticated,
  messagesController.newMessage
);

//GET MESSAGES
router.get(
  "/messages/:id",
  authMiddleware.isAuthenticated,
  messagesController.getMessages
);

/* Notifications */

router.get(
  "/users/me/notifications",
  authMiddleware.isAuthenticated,
  notificationController.getNotifications
);

router.get(
  "/users/me/notifications/read",
  authMiddleware.isAuthenticated,
  notificationController.readNotifications
);

router.get(
  "/users/me/messages/:id",
  authMiddleware.isAuthenticated,
  notificationController.getMessageNotifications
);

module.exports = router;
