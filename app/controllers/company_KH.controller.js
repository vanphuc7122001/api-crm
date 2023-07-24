const { Company_KH } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

exports.create = async (req, res, next) => {
  try {
    const document = await Company_KH.create({
      name: req.body.name,
    });
    return res.status(200).json({
      msg: document
        ? "Tạo công ty khách hàng thành công"
        : "Tạo công ty khách hàng thất bại",
      error: document ? false : true,
      document,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Company_KH.findAll();

    return res.status(200).json({
      msg:
        documents.length > 0
          ? "Danh sách công ty của khách hàng"
          : "Danh sách không tồn tại",
      error: documents.length > 0 ? false : true,
      documents: documents.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      ),
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Company_KH.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await Company_KH.destroy({
      where: {
        _id: id,
      },
    });

    return res.status(200).json({
      msg: document ? "Xóa thành công" : "Không tìm thấy thông tin để sửa!!",
      error: document ? false : true,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteAll = async (req, res, next) => {};

exports.update = async (req, res, next) => {
  const { id } = req.params;

  try {
    const document = await Company_KH.update(
      {
        name: req.body.name,
      },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

 
    return res.status(200).json({
      msg: document[0]
        ? "Sửa dử liệu thành công"
        : "Không tìm thấy dử liệu để sửa!!",
      statusCode: document[0] ? true : false,
      payload: document[0] ? document : undefined,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
