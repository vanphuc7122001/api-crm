const { Status_Task } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 1) {
    const { name } = req.body;
    const sta_tasks = await Status_Task.findAll();
    for (let value of sta_tasks) {
      if (value.name == name) {
        return res.send({
          error: true,
          msg: `Đã tồn tại trạng thái '${name}'`,
        });
      }
    }
    try {
      const document = await Status_Task.create({
        name: req.body.name,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công trạng thái '${document.name}'`,
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
    const documents = await Status_Task.findAll();
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
    const documents = await Status_Task.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(
      createError(400, `Lỗi không tìm thấy trạng thái '${document.name}'`)
    );
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const document = await Status_Task.destroy({
      where: { _id: req.params.id },
    });
    return res.send({
      msg: `Đã xoá thành công trạng thái`,
      document: Status_Task,
    });
  } catch (error) {
    return next(createError(400, "Lỗi không xóa được trạng thái!"));
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
