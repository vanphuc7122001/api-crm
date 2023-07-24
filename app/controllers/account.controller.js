const {
  Account,
  Role,
  Employee,
  Permission,
} = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { DataTypes, Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.create = async (req, res, next) => {
  const accounts = await Account.findAll();
  for (let value of accounts) {
    if (value.user_name == req.body.user_name) {
      return res.send({
        error: true,
        user_name: false,
        msg: `Đã tồn tại tài khoản ${value.user_name}.`,
      });
    }
  }

  if (Object.keys(req.body).length >= 4 && req.body.checkUser == false) {
    const { EmployeeId, roleId, password, user_name } = req.body;
    const accounts = await Account.findAll();
    for (let value of accounts) {
      if (value.user_name == user_name) {
        return res.send({
          error: true,
          msg: `Đã tồn tại tài khoản ${value.user_name}.`,
        });
      }
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const document = await Account.create({
        user_name: user_name,
        password: hashedPassword,
        roleId: roleId,
        EmployeeId: EmployeeId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công tài khoản ${document.user_name}`,
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
      user_name: true,
    });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Account.findAll({
      include: [
        {
          model: Role,
          include: [{ model: Permission }],
        },
        {
          model: Employee,
        },
        // Role,
        // Employee
        // Permission
      ],
    });
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all accounts!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Account.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding account !"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Account.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "Account not found"));
    }
    return res.send({
      msg: `Đã xoá thành công tài khoản ${account.user_name}`,
      document: account,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting account"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await Account.destroy({
      where: {},
      truncate: true, // Truncate the table to remove all records
    });

    if (result === 0) {
      // If no records were deleted, return an error
      // return next(createError(404, 'No accounts found'));
      return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
    }

    //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting accounts"));
  }
};

exports.update = async (req, res, next) => {
  console.log("Update", req.body);
  const { EmployeeId, roleId, password, user_name } = req.body;
  // Kiểm tra xem dữ liệu cần thiết có bị thiếu không
  if (!user_name || !password || !roleId || !EmployeeId) {
    return res.send({
      error: true,
      msg: "Vui lòng điền đầy đủ thông tin.",
    });
  }
  try {
    let accounts = [
      await Account.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    accounts = accounts.filter((value, index) => {
      return (
        value.user_name == user_name &&
        value.password == password &&
        value.roleId == roleId &&
        value.EmployeeId == EmployeeId
      );
    });

    if (accounts.length == 0) {
      const document = await Account.update(
        {
          EmployeeId: req.body.EmployeeId,
          roleId: req.body.roleId,
          password: req.body.password,
          user_name: req.body.user_name,
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

exports.login = async (req, res, next) => {
  try {
    const secretKey = "mysecretkey";
    const { user_name, password } = req.body;
    // Tìm người dùng trong danh sách người dùng
    let users = await Account.findAll({
      include: [
        {
          model: Role,
          include: [{ model: Permission }],
        },
        {
          model: Employee,
        },
      ],
    });

    users = users.filter((value, index) => {
      return value.user_name === user_name;
    });

    // console.log("Usersss login", users);

    if (users.length === 0) {
      return res.send({
        msg: "Tên tài khoản hoặc mật khẩu không hợp lệ!",
        error: true,
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // const isPasswordValid = true;
    if (isPasswordValid) {
      const token = jwt.sign({ userId: user.id }, secretKey);
      // console.log("user signed", user);
      return res.send({
        error: false,
        token: token,
        document: user,
      });
    } else {
      return res.send({
        msg: "Tên tài khoản hoặc mật khẩu không hợp lệ!",
        error: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
