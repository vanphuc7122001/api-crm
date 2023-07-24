const { Cycle } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 1) {
    const { name } = req.body;
    const cycles = await Cycle.findAll();
    for (let value of cycles) {
      if (value.name == name) {
        return res.send({
          error: true,
          msg: `Chu kỳ đã tồn tại.`,
        });
      }
    }
    try {
      const document = await Cycle.create({
        name: name,
      });
      return res.send({
        error: false,
        msg: `Tạo chu kỳ thành công`,
        document: document,
      });
    } catch (error) {
      console.log(error.errors[0].message);
      return res.send({
        error: true,
        msg: error.errors[0].message,
      });
    }
  } else {
    return res.send({
      error: true,
      msg: `Vui lòng nhập đủ thông tin.`,
    });
  }

};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Cycle.findAll();
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding cycle!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Cycle.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding cycle !"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const documents = await Cycle.destroy({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(`Đã xóa chu kỳ`);
  } catch (error) {
    return next(createError(400, "Lỗi không xóa được chu kỳ !"));
  }
};

exports.deleteAll = async (req, res, next) => {};

exports.update = async (req, res, next) => {};
