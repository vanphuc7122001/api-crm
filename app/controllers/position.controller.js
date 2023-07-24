const { Position } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 1) {
    const { name } = req.body;
    const positions = await Position.findAll();
    for (let value of positions) {
      if (value.name == name) {
        return res.send({
          error: true,
          msg: `Đã tồn tại chức vụ '${name}'`,
        });
      }
    }
    try {
      const document = await Position.create({
        name: req.body.name,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công chức vụ '${document.name}'`,
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
    const documents = await Position.findAll();
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
    const documents = await Position.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, `Xóa thành công chức vụ '${document.name}'`));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const document = await Position.destroy({
      where: { _id: req.params.id },
    });
    return res.send({
      msg: `Đã xoá thành công chức vụ`,
      document: Position,
    });
  } catch (error) {
    return next(createError(400, "Lỗi không xóa được chức vụ!"));
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
