const { Evaluate } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 1) {
    const { star } = req.body;
    const evaluates = await Evaluate.findAll();
    for (let value of evaluates) {
      if (value.star == star) {
        return res.send({
          error: true,
          msg: `Đã tồn tại '${star}'`,
        });
      }
    }
    try {
      const document = await Evaluate.create({
        star: req.body.star,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công '${document.star}'`,
        document: document,
      });
    } catch (error) {
      console.log(error.message);
      return res.send({
        error: true,
        msg: error.message,
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
    const documents = await Evaluate.findAll();
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding positions !"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Evaluate.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, `Lỗi không tìm thấy '${document.star}'`));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const document = await Evaluate.destroy({
      where: { _id: req.params.id },
    });
    return res.send({
      msg: `Đã xoá thành công`,
      document: Evaluate,
    });
  } catch (error) {
    return next(createError(400, "Lỗi không xóa được!"));
  }
};

exports.deleteAll = async (req, res, next) => {
  // try {
  //     const documents = await Position.destroy({ where: {} });
  //     return res.send(`Đã xóa.`);
  // } catch (error) {
  //     return next(createError(400, "Error delete employees !"));
  // }
};

exports.update = async (req, res, next) => {};
