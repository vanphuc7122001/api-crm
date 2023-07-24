const { Department, Center_VNPTHG } = require("../models/index.model.js");
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
  if (Object.keys(req.body).length >= 2) {
    const name = setEncrypt(req.body.name);
    const dep = await Department.findOne({
      where: {
        name: name,
        centerVNPTHGId: req.body.centerVNPTHGId,
      },
    });
    if (dep) {
      return res.send({
        error: true,
        msg: `Đã tồn tại phòng ${getDecrypt(name)}.`,
      });
    }
    try {
      const document = await Department.create({
        centerVNPTHGId: req.body.centerVNPTHGId,
        name: req.body.name,
      });

      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công phòng ${document.name} `,
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
    const documents = await Department.findAll({});
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding Departments !"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Department.findOne({
      where: {
        _id: req.params.id,
      },
      include: [
        {
          model: Center_VNPTHG,
        },
      ],
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding Department !"));
  }
};
//
exports.findAllDepOfACenter = async (req, res, next) => {
  try {
    const documents = await Department.findAll({
      where: {
        centerVNPTHGId: req.params.centerId,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding Department !"));
  }
};
exports.deleteOne = async (req, res, next) => {
  try {
    const dep = await Department.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const documents = await Department.destroy({
      where: { _id: req.params.id },
    });
    return res.send({
      msg: `Đã xoá thành công phòng ${dep.name} `,
      document: dep,
    });
  } catch (error) {
    return next(createError(400, "Error delete Department !"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const documents = await Department.destroy({ where: {} });
    return res.send(`Đã xóa ${documents} bản ghi.`);
  } catch (error) {
    return next(createError(400, "Error delete Department !"));
  }
};

exports.update = async (req, res, next) => {
  try {
    let dep = await Department.findOne({
      where: {
        _id: req.params.id,
      },
    });
    if (
      dep.name !== req.body.name ||
      dep.centerVNPTHGId !== req.body.centerVNPTHGId
    ) {
      const documents = await Department.update(
        { name: req.body.name, centerVNPTHGId: req.body.centerVNPTHGId },
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
    return next(createError(400, "Error update Department !"));
  }
};
