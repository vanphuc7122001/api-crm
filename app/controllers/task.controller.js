const {
  Task,
  Appointment,
  Employee,
  Cycle,
  Customer,
  Status_Task,
  Employee_Task,
  Status_App,
  Position,
  Unit,
  Department,
  Center_VNPTHG,
  Evaluate,
  Comment,
  Customer_Types,
  Customer_Work,
  Company_KH,
  Habit,
  Event,
  Log,
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
    const {
      start_date,
      end_date,
      content,
      cycleId,
      customerId,
      leaderId,
      note,
    } = req.body;
    var StatusTaskId;
    var EvaluateId;
    const tasks = await Task.findAll();
    for (let value of tasks) {
      if (
        value.customerId == customerId &&
        value.leaderId == leaderId &&
        value.start_date == start_date &&
        value.end_date == end_date
      ) {
        return res.send({
          error: true,
          msg: `Khách hàng đã được phân công.`,
        });
      }
    }
    try {
      const status_tasks = await Status_Task.findAll();
      var count = 0;
     
      if (status_tasks.length > 0) {
       
        for (let value of status_tasks) {
          
          value.dataValues.name = getDecrypt(value.dataValues.name);
          
          if (value.dataValues.name == "chưa chăm sóc") {
           
            StatusTaskId = value.dataValues._id;
           
            count = 0;
            break;
          } else {
            count = 1;
          }
        }
      
        if (count != 0) {
          const status_task = await Status_Task.create({
            name: "chưa chăm sóc",
          });
          StatusTaskId = status_task._id;
         
        }
       
      } else {
        const status_task = await Status_Task.create({
          name: "chưa chăm sóc",
        });
        StatusTaskId = status_task._id;
       
      }

      const evaluates = await Evaluate.findAll();
     
      if (evaluates.length > 0) {
    
        var a = 0;
        for (let value of evaluates) {
          value.dataValues.star = getDecrypt(value.dataValues.star);
          
          if (value.dataValues.star == "1 sao") {
            EvaluateId = value.dataValues._id;
            a = 0;
            break;
          } else {
            a = 1;
          }
        }
       
        if (a != 0) {
          const evaluate = await Evaluate.create({
            star: "1 sao",
          });
          EvaluateId = evaluate._id;
        }
      
      } else {
        const evaluate = await Evaluate.create({
          star: "1 sao",
        });
        EvaluateId = evaluate._id;
      }

      const document = await Task.create({
        start_date: start_date,
        end_date: end_date,
        content: content,
        cycleId: cycleId,
        customerId: customerId,
        leaderId: leaderId,
        note: note,
        StatusTaskId: StatusTaskId,
        EvaluateId: EvaluateId,
      });
    
      const comment = await Comment.create({
        content: "Chưa có đánh giá nào",
        TaskId: document._id,
      });

      const user = await Employee.findOne({
        where: {
          _id: req.body.loginId,
        },
      });
      const cycleLog = await Cycle.findOne({
        where: {
          _id: document.cycleId,
        },
      });
     
      user.dataValues.name = getDecrypt(user.dataValues.name);
      user.dataValues.birthday = getDecrypt(user.dataValues.birthday);
      user.dataValues.phone = getDecrypt(user.dataValues.phone);
      const userInfo = `Họ tên:${user.dataValues.name}, Ngày sinh: ${user.dataValues.birthday}, SĐT: ${user.dataValues.phone}, Id nhân viên: ${req.body.loginId}`;
     
      const formattedDateTime = this.dateTime();
      const contentLog = `Thêm phân công ngày bắt đầu ${start_date} và ngày kết thúc ${end_date} với chu kỳ ${cycleLog.name}`;
      const logCreateTask = await Log.create({
        created_at: formattedDateTime,
        created_user: userInfo,
        content: contentLog,
      });
      return res.send({
        error: false,
        msg: `Tạo phân công thành công`,
        document: document,
      });
    } catch (error) {
      // console.log(error.errors[0].message);
      return res.send({
        error: true,
        // msg: error.errors[0].message,
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
    const documents = await Task.findAll({
      include: [
        {
          model: Employee,
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
            // Unit,
          ],
        },
        {
          model: Status_Task,
          // attribute: ['status','reason']
        },
        {
          model: Customer,
          include: [
            {
              model: Customer_Types,
            },
            {
              model: Customer_Work,
              include: [
                {
                  model: Company_KH,
                },
              ],
            },
            {
              model: Habit,
            },
            {
              model: Event,
            },
          ],
        },
        {
          model: Cycle,
        },
        {
          model: Appointment,
          include: [
            {
              model: Status_App,
            },
          ],
        },
        {
          model: Evaluate,
        },
        {
          model: Comment,
        },
      ],
    });

  

    for (let i = 0; i < documents.length; i++) {
      var employees = await Employee_Task.findAll({
        where: {
          TaskId: documents[i].dataValues._id,
        },
      });

    
      documents[i].dataValues["EmployeesList"] = employees;
    }
    /////////////////////////////////////////////////
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Không tìm thấy phân công!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
   
    const documents = await Task.findOne({
      where: {
        _id: req.params.id,
      },
      include: [
        {
          model: Status_Task,
          // attribute: ['status','reason']
        },
        {
          model: Customer,
          include: [
            {
              model: Customer_Types,
            },
            {
              model: Customer_Work,
              include: [
                {
                  model: Company_KH,
                },
              ],
            },
            {
              model: Event,
            },
            {
              model: Habit,
            },
          ],
        },
        {
          model: Cycle,
        },
        {
          model: Appointment,
          include: [
            {
              model: Status_App,
            },
          ],
        },
        {
          model: Evaluate,
        },
        {
          model: Comment,
        },
      ],
    });
    const employee1 = await Employee_Task.findAll({
      where: {
        TaskId: req.params.id,
        //   through: { attributes: [] }, // Đảm bảo không lấy các trường trong bảng trung gian
      },
    });
    documents.dataValues["Employees"] = [];
    var i;
    for (i = 0; i < employee1.length; i++) {
     
      const employee = await Employee.findOne({
        where: { _id: employee1[i].dataValues.EmployeeId },
      });
      
      const position = await Position.findOne({
        where: { _id: employee.dataValues.postionId },
      });
    
      const unit = await Unit.findOne({
        where: { _id: employee.dataValues.unitId },
      });
      const department = await Department.findOne({
        where: { _id: unit.dataValues.departmentId },
      });
      const center = await Center_VNPTHG.findOne({
        where: { _id: department.dataValues.centerVNPTHGId },
      });
    
      employee.dataValues.name = getDecrypt(employee.dataValues.name);
      employee.dataValues.phone = getDecrypt(employee.dataValues.phone);
      employee.dataValues.email = getDecrypt(employee.dataValues.email);
      employee.dataValues.address = getDecrypt(employee.dataValues.address);
      employee.dataValues.birthday = getDecrypt(employee.dataValues.birthday);
      position.dataValues.name = getDecrypt(position.dataValues.name);
      unit.dataValues.name = getDecrypt(unit.dataValues.name);
      department.dataValues.name = getDecrypt(department.dataValues.name);
      center.dataValues.name = getDecrypt(center.dataValues.name);
      documents.dataValues.Employees[i] = employee.dataValues;
      documents.dataValues.Employees[i].Position = position.dataValues;
      documents.dataValues.Employees[i].Unit = unit.dataValues;
      documents.dataValues.Employees[i].Unit.Department = department.dataValues;
      documents.dataValues.Employees[i].Unit.Department.Center =
        center.dataValues;
      //   documents.dataValues["Tasks"] = employee1.dataValues.Tasks;
    }
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Không tìm thấy phân công !"));
  }
};
exports.deleteOne = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: {
        _id: req.params.id,
      },
      include: [
        {
          model: Customer,
        },
      ],
    });
  
    const documents = await Task.destroy({
      where: {
        _id: req.params.id,
      },
    });

    const user = await Employee.findOne({
      where: {
        _id: task.dataValues.leaderId,
      },
    });
  
    user.dataValues.name = getDecrypt(user.dataValues.name);
    user.dataValues.birthday = getDecrypt(user.dataValues.birthday);
    user.dataValues.phone = getDecrypt(user.dataValues.phone);
    task.dataValues.start_date = getDecrypt(task.dataValues.start_date);
    task.dataValues.end_date = getDecrypt(task.dataValues.end_date);
    const userInfo = `${user.dataValues.name} ${user.dataValues.birthday} ${user.dataValues.phone} ${task.dataValues.leaderId}`;
  
    const formattedDateTime = this.dateTime();
    const contentLog = `Xóa phân công ngày bắt đầu ${task.dataValues.start_date} và ngày kết thúc ${task.dataValues.end_date}`;
   
    const logDelTask = await Log.create({
      created_at: formattedDateTime,
      created_user: userInfo,
      content: contentLog,
    });

    return res.json({
      msg: `Đã xóa phân công`,
      documents: task.dataValues,
    });
  } catch (error) {
    return next(createError(400, "Lỗi không xóa được phân công !"));
  }
};

exports.deleteAll = async (req, res, next) => {};

exports.update = async (req, res, next) => {

  if (req.body.changeStatus) {
    var EditStatusTask;
    const statustask = await Status_Task.findAll();
    var c = 0;
    for (let value of statustask) {
      value.dataValues.name = getDecrypt(value.dataValues.name);
      
      if (value.dataValues.name == "đang chăm sóc") {
        c = 0;
        EditStatusTask = value.dataValues._id;
        break;
      } else {
        c = 1;
      }
    }
    if (c != 0) {
      const statustask1 = await Status_Task.create({
        name: "đang chăm sóc",
      });
      EditStatusTask = statustask1._id;
      
    }

    const document = await Task.update(
      {
        StatusTaskId: EditStatusTask,
      },
      { where: { _id: req.params.id }, returning: true }
    );
    return res.send({
      error: false,
      msg: "Dữ liệu đã được thay đổi thành công.",
    });
  } else if (req.body.fb == true) {
 
    try {
      let tasks1 = [
        await Task.findOne({
          where: {
            _id: req.params.id,
          },
          include: [
            {
              model: Status_Task,
            },
            {
              model: Cycle,
            },
            {
              model: Comment,
            },
          ],
        }),
      ];

      tasks1 = tasks1.filter((value, index) => {
        return (
          value.EvaluateId == req.body.EvaluateId &&
          value.Comment.content == req.body.Comment.content
        );
      });
      if (tasks1.length == 0) {
        const comment = await Comment.update(
          {
            content: req.body.Comment.content,
          },
          { where: { TaskId: req.params.id }, returning: true }
        );
        
        const task = await Task.update(
          {
            EvaluateId: req.body.EvaluateId,
          },
          {
            where: { _id: req.params.id },
            returning: true,
          }
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
  } else {
 
    const {
      start_date,
      end_date,
      content,
      cycleId,
      customerId,
      leaderId,
      note,
      StatusTaskId,
      EvaluateId,
    } = req.body;
  
    try {
      let tasks = [
        await Task.findOne({
          where: {
            _id: req.params.id,
          },
        }),
      ];
      tasks[0].dataValues.start_date = getDecrypt(
        tasks[0].dataValues.start_date
      );
      tasks[0].dataValues.end_date = getDecrypt(tasks[0].dataValues.end_date);
      tasks[0].dataValues.content = getDecrypt(tasks[0].dataValues.content);
      tasks[0].dataValues.note = getDecrypt(tasks[0].dataValues.note);
      tasks = tasks.filter((value, index) => {
        return (
          value.dataValues.start_date == start_date &&
          value.dataValues.end_date == end_date &&
          value.dataValues.content == content &&
          value.dataValues.cycleId == cycleId &&
          value.dataValues.customerId == customerId &&
          value.dataValues.leaderId == leaderId &&
          value.dataValues.note == note &&
          value.dataValues.StatusTaskId == StatusTaskId &&
          value.dataValues.EvaluateId == EvaluateId
        );
      });
      if (tasks.length == 0) {
     
        let document = {};
        if (req.body.note == null) {
         
          document = await Task.update(
            {
              start_date: req.body.start_date,
              end_date: req.body.end_date,
              content: req.body.content,
              cycleId: req.body.cycleId,
              customerId: req.body.customerId,
              leaderId: req.body.leaderId,
              note: "",
              StatusTaskId: req.body.StatusTaskId,
              EvaluateId: req.body.EvaluateId,
            },
            { where: { _id: req.params.id }, returning: true }
          );
        } else if (req.body.note != null) {
        
          document = await Task.update(
            {
              start_date: req.body.start_date,
              end_date: req.body.end_date,
              content: req.body.content,
              cycleId: req.body.cycleId,
              customerId: req.body.customerId,
              leaderId: req.body.leaderId,
              note: req.body.note,
              StatusTaskId: req.body.StatusTaskId,
              EvaluateId: req.body.EvaluateId,
            },
            { where: { _id: req.params.id }, returning: true }
          );
        }

        const comment = await Comment.update(
          {
            content: req.body.Comment.content,
          },
          { where: { TaskId: req.params.id }, returning: true }
        );

      
        const user = await Employee.findOne({
          where: {
            _id: req.body.loginId,
          },
        });
       
        user.dataValues.name = getDecrypt(user.dataValues.name);
        user.dataValues.birthday = getDecrypt(user.dataValues.birthday);
        user.dataValues.phone = getDecrypt(user.dataValues.phone);
        const userInfo = `Họ tên: ${user.dataValues.name}, Ngày sinh: ${user.dataValues.birthday}, SĐT: ${user.dataValues.phone},Id nhân viên: ${req.body.loginId}`;
        const formattedDateTime = this.dateTime();
        const contentLog = `Chỉnh sửa phân công ngày bắt đầu ${start_date} và ngày kết thúc ${end_date} với nội dung ${content}`;
        const logCreateTask = await Log.create({
          created_at: formattedDateTime,
          created_user: userInfo,
          content: contentLog,
        });
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
  }
};

exports.dateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};
