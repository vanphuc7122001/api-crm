const { Habit, Customer } = require("../models/index.model.js");
const { DataTypes, Op } = require("sequelize");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

// checked
exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 1) {
    const { name } = req.body;
    const habits = await Habit.findAll();
    for (let value of habits) {
      if (value.name == name) {
        return res.send({
          error: true,
          msg: `Đã tồn tại thói quen ${value.name}.`,
          document: value,
        });
      }
    }
    try {
      const document = await Habit.create({
        name: name,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công thói quen ${document.name}.`,
        document: document,
      });
    } catch (error) {
      console.log(error.errors[0].message);
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

// checked
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Habit.findAll({
      include: Customer,
    });
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error findAll !"));
  }
};

// checked
exports.findOne = async (req, res, next) => {
  try {
    const document = await Habit.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(document);
  } catch (error) {
    return next(createError(400, "Error findOne"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const document = await Habit.destroy({
      where: {
        _id: req.params.id,
      },
      returning: true,
    });

    return res.send({
      msg: `Đã xoá thành công thói quen ${habit.name}.`,
      document: habit,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleteOne"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.update = async (req, res, next) => {
  
  const { name } = req.body;
  try {
    let habits = [
      await Habit.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    habits = habits.filter((value, index) => {
      return value.name == name;
    });

    if (habits.length == 0) {
      const document = await Habit.update(
        {
          name: name,
        },
        { where: { _id: req.params.id }, returning: true }
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
    return next(createError(400, "Error update"));
  }
};
