const { Notification } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
// const { sequelize } = require("../config/index");

// _id, content , isRead, recipient, sender
exports.create = async (req, res, next) => {
  const { content, recipient, sender, title, idRecipient } = req.body;
  if (content && recipient && title && idRecipient) {
    try {
      const document = await Notification.create({
        content,
        recipient,
        sender,
        title,
        idRecipient,
      });

      return res.status(200).json({
        error: document ? false : true,
        msg: document
          ? "Thông báo được tạo thành công"
          : "Thông báo được tạo thất bại",
      });
    } catch (error) {
      return next(createError(500, error.message));
    }
  } else {
    res.status(200).json({
      msg: "Không được để chống nội dung, thông tin người nhận, tiêu đề thông báo, id người nhận",
      error: true,
    });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Notification.findAll({});

    return res.status(200).json({
      msg:
        documents.length > 0
          ? "Danh sách thông báo!!"
          : "Không có thông báo nào",
      error: documents.length > 0 ? false : true,
      documents: documents.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      ),
    });
  } catch (err) {
    return next(createError(500, err.message));
  }
};

exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const documents = await Notification.findAll({
      where: {
        idRecipient: id,
      },
    });

    return res.status(200).json({
      msg:
        documents.length > 0
          ? "Danh sách thông báo!!"
          : "Không có thông báo nào",
      error: documents.length > 0 ? false : true,
      documents,
    });
  } catch (err) {
    return next(createError(500, err.message));
  }
};

exports.deleteOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const documents = await Notification.destroy({
      where: {
        _id: id,
      },
    });

    return res.status(200).json({
      error: documents ? false : true,
      msg: documents
        ? "Bạn vừa xóa thành công thông báo"
        : "Không thể tìm thấy thông báo để xóa!!",
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await Notification.update(
      {
        isRead: true,
      },
      {
        where: {
          _id: id,
        },
      }
    );

    return res.status(200).json({
      error: document[0] ? false : true,
      msg: document[0]
        ? "Dử liệu thay đổi thành công"
        : "Không thể tìm thấy dử liệu để thay đổi!!",
      document: document,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteAll = async (req, res, next) => {
  const { id } = req.params;
  try {
    const documents = Notification.destroy({
      where: {
        idRecipient: id,
      },
      //   truncate: true,
    });

    return res.status(200).json({
      error: documents ? false : true,
      msg: documents ? "Xóa tất cả thông báo thành công" : "Xóa thất bại",
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

// lấy tất cả thông báo người dùng chua đọc
exports.findAllUnread = async (req, res, next) => {
  const { id } = req.params;
  try {
    const documents = await Notification.findAll({
      where: {
        idRecipient: id,
        isRead: false,
      },
    });

    return res.status(200).json({
      msg:
        documents.length > 0
          ? "Danh sách thông báo!!"
          : "Không có thông báo nào",
      error: documents.length > 0 ? false : true,
      documents,
    });
  } catch (err) {
    return next(createError(500, err.message));
  }
};

exports.findAllReaded = async (req, res, next) => {
  const { id } = req.params;
  try {
    const documents = await Notification.findAll({
      where: {
        idRecipient: id,
        isRead: true,
      },
    });

    return res.status(200).json({
      msg:
        documents.length > 0
          ? "Danh sách thông báo!!"
          : "Không có thông báo nào",
      error: documents.length > 0 ? false : true,
      documents,
    });
  } catch (err) {
    return next(createError(500, err.message));
  }
};
