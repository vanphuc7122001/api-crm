const express = require("express");
const notification = require("../controllers/notification.controller");

const router = express.Router();

router.route("/").post(notification.create).get(notification.findAll);

router
  .route("/:id")
  .put(notification.update)
  .delete(notification.deleteOne)
  .get(notification.findOne);

router.delete("/delete-notification-by-id/:id", notification.deleteAll);
router.get("/unread-notice/:id", notification.findAllUnread);
router.get("/readed/:id", notification.findAllReaded);

// lấy tất cả thông báo người dùng chưa đọc và đã đọc

router;
module.exports = router;