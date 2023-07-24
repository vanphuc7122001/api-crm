const { Employee_Task, Task, Employee } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 2) {
    const { TaskId, EmployeeId } = req.body;
    const task_em = await Employee_Task.findAll();
    for (let value of task_em) {
      if (value.TaskId == TaskId && value.EmployeeId == EmployeeId) {
        return res.send({
          error: true,
          msg: `Đã tồn tại phân công .`,
        });
      }
    }
    try {
      const document = await Employee_Task.create({
        TaskId: TaskId,
        EmployeeId: EmployeeId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã phân công thành công`,
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
    const documents = await Employee_Task.findAll({
      include: [],
    });
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all task!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Employee_Task.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding task !"));
  }
};

exports.deleteOne = async (req, res, next) => {
  // console.log("req.body DET:", req.body, "------------");
  try {
    const documents = await Employee_Task.destroy({
      where: {
        TaskId: req.body.TaskId,
        EmployeeId: req.body.EmployeeId,
      },
    });
    return res.send(`Đã xóa công việc của nhân viên`);
  } catch (error) {
    return next(createError(400, "Lỗi không xóa được công việc!"));
  }
};
