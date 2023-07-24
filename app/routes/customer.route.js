const router = require("express").Router();
const customers = require("../controllers/customer.controller");
const { uploadImages } = require("../middlewares/uploads/upload-img");

router
  .route("/:id")
  .put(uploadImages("avatar"), customers.update)
  .get(customers.findOne)
  .delete(customers.deleteOne);

router
  .route("/")
  .post(uploadImages("avatar"), customers.create)
  // .post(, uploadImages("avatar"))
  .get(customers.findAll)
  .delete(customers.deleteAll);

module.exports = router;