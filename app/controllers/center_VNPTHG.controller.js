const { Center_VNPTHG } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const encryptionKey = "12345678912345678901234567890121";
const iv = "0123456789abcdef";

const setEncrypt = (value) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
const getDecrypt = (name) => {
  if (name) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
    let decrypted = decipher.update(name, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
};
exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length >= 1) {
    const name = setEncrypt(req.body.name);
    const center = await Center_VNPTHG.findOne({
      where: {
        name: name,
      },
    });
    if (center) {
      return res.send({
        error: true,
        msg: `Đã tồn tại trung tâm ${getDecrypt(name)}.`,
      });
    }
    try {
      const document = await Center_VNPTHG.create({
        name: req.body.name,
      });

      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công trung tâm ${document.name} `,
        document: document,
      });
    } catch (error) {
      console.log(error);
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
    const documents = await Center_VNPTHG.findAll({});
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error findAll Centers !"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Center_VNPTHG.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding Center_VNPTHG !"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const center = await Center_VNPTHG.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const documents = await Center_VNPTHG.destroy({
      where: { _id: req.params.id },
    });
    return res.send({
      msg: `Đã xoá thành công trung tâm ${center.name} `,
      document: center,
    });
  } catch (error) {
    return next(createError(400, "Error deleteOne Center_VNPTHG !"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const documents = await Center_VNPTHG.destroy({ where: {} });
    return res.send(`Đã xóa ${documents} bản ghi.`);
  } catch (error) {
    return next(createError(400, "Error delete Center_VNPTHG !"));
  }
};

exports.update = async (req, res, next) => {
  try {
    let center = await Center_VNPTHG.findOne({
      where: {
        _id: req.params.id,
      },
    });
    if (center.name !== req.body.name) {
      const documents = await Center_VNPTHG.update(
        { name: req.body.name },
        { where: { _id: req.params.id } }
      );
      return res.send({
        error: false,
        msg: "Dữ liệu đã được thay đổi thành công.",
      });
    } else {
      return res.send({
        error: true,
        msg: "Dữ liệu chưa được thay đổi.",
      });
    }
  } catch (error) {
    return next(createError(400, "Error update Center_VNPTHG !"));
  }
};
