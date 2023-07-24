const {
  Customer_Types,
  Customer,
  Task,
  Status_Task,
  Evaluate,
  Comment,
  Cycle,
} = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path_lib = require("path");
const { Model } = require("sequelize");
const POSITION_CUT_LINK_IMAGE = 21;

exports.create = async (req, res, next) => {

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  } else {
    const { path } = req.file;
    const imgUrl = path.slice(4, path.length);
    const image = `http://localhost:3000/${imgUrl}`;
    const newCustomer = {
      ...req.body,
      avatar: image,
    };

    try {

      const customer = await Customer.create({
        ...newCustomer,
      });
      return res.status(200).json({
        msg: customer
          ? "Thêm khách hàng thành công"
          : "Thêm khách hàng thất bại",
        error: customer ? false : true,
        document: customer,
      });
    } catch (error) {
      console.log(error);
      return next(createError(500, error.message));
    }
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Customer.findAll();
    return res.status(200).json({
      msg:
        documents.length > 0
          ? "Danh sách khách hàng!!"
          : "Không có khách hàng nào",
      error: documents.length > 0 ? false : true,
      documents: documents.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      ),
    });
  } catch (error) {
    return next(createError(400, error.message));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Customer.findOne({
      where: {
        _id: req.params.id,
      },
      include: [
        {
          model: Task,
          include: [
            { model: Status_Task },
            {
              model: Evaluate,
            },
            {
              model: Comment,
            },
            {
              model: Cycle,
            },
          ],
        },
      ],
    });
    return res.status(200).json({
      msg: documents
        ? "Thông tin khách hàng"
        : "Thông tin khách hàng không tồn tại!!",
      error: documents ? false : true,
      documents: documents,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteOne = async (req, res, next) => {
  const { id } = req.params;
  const customer = await Customer.findOne({
    where: {
      _id: id,
    },
  });

  try {
    if (customer) {
      const linkImage = customer.avatar.slice(
        POSITION_CUT_LINK_IMAGE,
        customer.avatar.length
      );
      const imagePath = path_lib.join(__dirname, "../", linkImage);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Deleted image fail", err);
        } else {
          console.log("Deleted image successfully");
        }
      });

      const deleteCustomer = await Customer.destroy({
        where: {
          _id: id,
        },
      });

      return res.status(200).json({
        msg: deleteCustomer
          ? "Xóa khách hàng thành công"
          : "Xóa khách hàng không thành công",
        error: deleteCustomer ? false : true,
      });
    } else {
      return res.status(200).json({
        msg: "Không tìm thấy khách hàng để xóa!!",
        error: true,
      });
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteAll = async (req, res, next) => {
  res.send("Xóa tất cả các khách hàng đã chọn");
};

exports.update = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!req.file) {
      const newCustomer = {
        ...req.body,
      };
      const updatedCustomer = await Customer.update(
        {
          ...newCustomer,
        },
        {
          where: {
            _id: id,
          },
        }
      );
      return res.status(200).json({
        msg: updatedCustomer
          ? "Sửa thông tin khách hàng thành công!!"
          : "Ko tìm thấy thông tin khách hàng để xóa!!",
        error: updatedCustomer ? false : true,
      });
    } else {
      const customer = await Customer.findOne({
        where: {
          _id: id,
        },
      });

      const linkImage = customer.avatar.slice(
        POSITION_CUT_LINK_IMAGE,
        customer.avatar.length
      );
      const imagePath = path_lib.join(__dirname, "../", linkImage);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Deleted image fail", err);
        } else {
          console.log("Deleted image successfully");
        }
      });

      const { path } = req.file;

      const imgUrl = path.slice(4, path.length);
      const image = `http://localhost:3000/${imgUrl}`;
  
      const newCustomer = {
        ...req.body,
        avatar: image,
      };
      const updatedCustomer = await Customer.update(
        {
          ...newCustomer,
        },
        {
          where: {
            _id: id,
          },
        }
      );
      return res.status(200).json({
        msg: updatedCustomer
          ? "Sửa thông tin khách hàng thành công!!"
          : "Không tìm thấy dử liệu để sửa!!",
        error: updatedCustomer ? false : true,
        document: updatedCustomer,
      });
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
