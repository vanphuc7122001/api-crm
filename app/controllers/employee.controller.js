const {
  Employee,
  Unit,
  Position,
  Department,
  Center_VNPTHG,
  Employee_Task,
  Task,
  Cycle,
  Customer,
  Status_Task,
} = require("../models/index.model.js");
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
  if (Object.keys(req.body).length >= 7) {
    const { name, birthday, address, phone, email, postionId, unitId } =
      req.body;
    const employees = await Employee.findAll();
    for (let value of employees) {
      if (value.name == name && value.phone == phone && value.email == email) {
        return res.send({
          error: true,
          msg: `Đã tồn tại nhân viên.`,
        });
      }
    }
    try {
      const document = await Employee.create({
        name: req.body.name,
        birthday: req.body.birthday,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        postionId: req.body.postionId,
        unitId: req.body.unitId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công nhân viên ${document.name}`,
        document: document,
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
    const documents = await Employee.findAll({
      include: [
        {
          model: Task,
        },
        {
          model: Position,
          attributes: ["_id", "name"],
        },
        {
          model: Unit,
          attributes: ["_id", "name"],
          include: [
            {
              model: Department,
              attributes: ["_id", "name"],
              include: [
                {
                  model: Center_VNPTHG,
                  attributes: ["_id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding employees !"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Employee.findOne({
      where: {
        _id: req.params.id,
      },
      include: [
        {
          model: Position,
        },
        {
          model: Unit,
          include: [
            {
              model: Department,
              include: [
                {
                  model: Center_VNPTHG,
                },
              ],
            },
          ],
        },
      ],
    });
    const employee1 = await Employee.findByPk(req.params.id, {
      include: [
        {
          model: Task,
          // through: { attributes: [] }, // Đảm bảo không lấy các trường trong bảng trung gian
        },
      ],
    });

    if (employee1.dataValues.Tasks.length > 0) {
      var i;
      for (i = 0; i < employee1.dataValues.Tasks.length; i++) {
        const cycles = await Cycle.findOne({
          where: {
            _id: employee1.dataValues.Tasks[i].cycleId,
          },
        });
        cycles.dataValues.name = getDecrypt(cycles.dataValues.name);
        const customer = await Customer.findOne({
          where: {
            _id: employee1.dataValues.Tasks[i].customerId,
          },
        });
        customer.dataValues.name = getDecrypt(customer.dataValues.name);
        customer.dataValues.avatar = getDecrypt(customer.dataValues.avatar);
        customer.dataValues.phone = getDecrypt(customer.dataValues.phone);
        customer.dataValues.email = getDecrypt(customer.dataValues.email);
        customer.dataValues.address = getDecrypt(customer.dataValues.address);
        customer.dataValues.birthday = getDecrypt(customer.dataValues.birthday);

        if (employee1.dataValues.Tasks[i].StatusTaskId) {
          const status = await Status_Task.findOne({
            where: {
              _id: employee1.dataValues.Tasks[i].StatusTaskId,
            },
          });
          status.dataValues.name = getDecrypt(status.dataValues.name);
          employee1.dataValues.Tasks[i].dataValues.Status = status.dataValues;
        }

        employee1.dataValues.Tasks[i].dataValues.Cycles = cycles.dataValues;
        employee1.dataValues.Tasks[i].dataValues.Customers =
          customer.dataValues;
      }
      documents.dataValues["Tasks"] = employee1.dataValues.Tasks;
    }

    // return res.send(employee1.Tasks);
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding employee !"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const document = await Employee.destroy({
      where: {
        _id: req.params.id,
      },
      returning: true,
    });

    return res.send({
      msg: ` Đã xoá thành công nhân viên ${employee.name}`,
      document: employee,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleteOne"));
  }
};

exports.deleteAll = async (req, res, next) => {
  // try {
  //     const documents = await Employee.destroy({ where: {} });
  //     return res.send(Đã xóa.);
  // } catch (error) {
  //     return next(createError(400, "Error delete employees !"));
  // }
};

exports.update = async (req, res, next) => {
  const { name, birthday, address, phone, email, postionId, unitId } = req.body;
  try {
    let employees = [
      await Employee.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    employees = employees.filter((value, index) => {
      return (
        value.name == name &&
        value.birthday == birthday &&
        value.address == address &&
        value.phone == phone &&
        value.email == email &&
        value.postionId == postionId &&
        value.unitId == unitId
      );
    });

    if (employees.length == 0) {
      const document = await Employee.update(
        {
          name: req.body.name,
          birthday: req.body.birthday,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email,
          postionId: req.body.postionId,
          unitId: req.body.unitId,
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
