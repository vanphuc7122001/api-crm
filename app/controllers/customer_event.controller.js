const {
  Permission,
  Role_Permission,
  Role,
  Customer_Event,
} = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");

exports.create = async (req, res, next) => {
 
  if (Object.keys(req.body).length === 2) {
    const { customerId, eventId } = req.body;
    const permissions = await Customer_Event.findAll();
    for (let value of permissions) {
      if (value.customerId == customerId && value.eventId == eventId) {
        return res.send({
          error: true,
          msg: `Đã tồn tại ${value.name}.`,
        });
      }
    }
    try {
      const document = await Customer_Event.create({
        CustomerId: customerId,
        EventId: eventId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công  ${document.name}`,
        document,
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
    const documents = await Customer_Event.findAll({
      include: [],
    });
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all permissions!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Customer_Event.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding permission !"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const result = await Customer_Event.destroy({
      where: {
        CustomerId: req.body.CustomerId,
        EventId: req.body.EventId,
      },
    });

    if (result === 0) {
      // If no records were deleted, return an error
      return next(createError(404, "Role not found"));
    }
    return res.send({
      document: result,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting role"));
  }
};
