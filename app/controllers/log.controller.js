const { Log } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

exports.create = async (req, res, next) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
   
    const document = await Log.create({
      created_at: formattedDateTime,
      created_user: req.body.created_user,
      content: req.body.content,
    });
    return res.send({
      error: false,
      msg: `Bạn đã tạo thành công truy vết.`,
      document: document,
    });
  } catch (error) {
    console.log(error);
    // console.log(error.errors[0].message);
    return res.send({
      error: true,
      // msg: error.errors[0].message
    });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Log.findAll({});
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error findAll !"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Log.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding Log !"));
  }
};

exports.deleteOne = async (req, res, next) => {};

exports.deleteAll = async (req, res, next) => {};

exports.update = async (req, res, next) => {};
