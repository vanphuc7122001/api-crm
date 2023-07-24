const {
  Permission,
  Role_Permission,
  Role,
  Customer_Habit,
} = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");

exports.create = async (req, res, next) => {

  if (Object.keys(req.body).length === 2) {
    const { customerId, habitId } = req.body;
    const permissions = await Customer_Habit.findAll();
    for (let value of permissions) {
      if (value.customerId == customerId && value.habitId == habitId) {
        return res.send({
          error: true,
          msg: `Đã tồn tại quyền ${value.name}.`,
        });
      }
    }
    try {
      const document = await Customer_Habit.create({
        CustomerId: customerId,
        HabitId: habitId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công quyền ${document.name}`,
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
    const documents = await Customer_Habit.findAll({
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
    const documents = await Customer_Habit.findOne({
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
    const result = await Customer_Habit.destroy({
      where: {
        CustomerId: req.body.CustomerId,
        HabitId: req.body.HabitId,
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
