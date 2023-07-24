const { DataTypes, Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");
const crypto = require("crypto");

const setPrimary = {
  type: DataTypes.STRING,
  defaultValue: () => uuidv4(),
  primaryKey: true,
};

const encryptionKey = "12345678912345678901234567890121";
const iv = "0123456789abcdef";

const setEncrypt = (value, name, modelInstance) => {
  if (value.length == 0) {
    let encrypted = "";
    modelInstance.setDataValue(name, encrypted);
  } else {
    const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");
    modelInstance.setDataValue(name, encrypted);
  }
};

const getDecrypt = (name, modelInstance) => {
  const value = modelInstance.getDataValue(name);
  if (value) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
    let decrypted = decipher.update(value, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
  return null;
};

// Models
const Customer_Types = sequelize.define("Customer_Types", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên loại khách hàng không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Customer = sequelize.define("Customer", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên khách hàng không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
  birthday: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày sinh không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("birthday", this);
    },
    set(value) {
      setEncrypt(value, "birthday", this);
    },
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
    // default:
    //     "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png",
    validate: {
      notEmpty: {
        msg: "Ảnh khách hàng không được bỏ trống không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("avatar", this);
    },
    set(value) {
      setEncrypt(value, "avatar", this);
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Địa chỉ khách hàng không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("address", this);
    },
    set(value) {
      setEncrypt(value, "address", this);
    },
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "SDT khách hàng không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("phone", this);
    },
    set(value) {
      setEncrypt(value, "phone", this);
    },
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "",
    get() {
      return getDecrypt("email", this);
    },
    set(value) {
      setEncrypt(value, "email", this);
    },
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "",
    get() {
      return getDecrypt("note", this);
    },
    set(value) {
      setEncrypt(value, "note", this);
    },
  },
  gender: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "",
    get() {
      return getDecrypt("gender", this);
    },
    set(value) {
      setEncrypt(value, "gender", this);
    },
  },
});

const Customer_Work = sequelize.define("Customer_Work", {
  _id: setPrimary,
  current_workplace: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên công việc không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("current_workplace", this);
    },
    set(value) {
      setEncrypt(value, "current_workplace", this);
    },
  },
  work_history: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Lịch sử làm việc không được bỏ trống",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("work_history", this);
    },
    set(value) {
      setEncrypt(value, "work_history", this);
    },
  },
  current_position: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Vị trí công việc không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("current_position", this);
    },
    set(value) {
      setEncrypt(value, "current_position", this);
    },
  },
  work_temp: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "",
    get() {
      return getDecrypt("work_temp", this);
    },
    set(value) {
      setEncrypt(value, "work_temp", this);
    },
  },
});

const Company_KH = sequelize.define("Company_KH", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Công ty KH không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Event = sequelize.define("Event", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    underscored: true,
    validate: {
      notEmpty: {
        msg: "Tên sự kiện không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
  time_duration: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Thời gian diễn ra sự kiện không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("time_duration", this);
    },
    set(value) {
      setEncrypt(value, "time_duration", this);
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Nội dung sự kiện không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("content", this);
    },
    set(value) {
      setEncrypt(value, "content", this);
    },
  },
  place: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return getDecrypt("place", this);
    },
    set(value) {
      setEncrypt(value, "place", this);
    },
  },
});

const Habit = sequelize.define("Habit", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên thói quen không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Position = sequelize.define("Position", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    underscored: true,
    validate: {
      notEmpty: {
        msg: "Tên vị trí không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Center_VNPTHG = sequelize.define("Center_VNPTHG", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    underscored: true,
    validate: {
      notEmpty: {
        msg: "Tên trung tâm không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Department = sequelize.define("Department", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    underscored: true,
    validate: {
      notEmpty: {
        msg: "Tên phòng không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Unit = sequelize.define("Unit", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    underscored: true,
    validate: {
      notEmpty: {
        msg: "Tên đơn vị không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Permission = sequelize.define("Permission", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên quyền không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Permission_Types = sequelize.define("Permission_Types", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên loại quyền không được bỏ trống.",
      },
      // len: {
      //     args: [1, Infinity], // Độ dài từ 1 ký tự trở lên
      //     msg: 'Tên người dùng không được bỏ trống.',
      // },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Role = sequelize.define("Role", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên chức năng không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Cycle = sequelize.define("Cycle", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Nội dung không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Employee = sequelize.define("Employee", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên nhân viên không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
  birthday: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày sinh nhân viên không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("birthday", this);
    },
    set(value) {
      setEncrypt(value, "birthday", this);
    },
  },
  // avatar: {
  //     type: DataTypes.TEXT,
  //     allowNull: false,
  //     validate: {
  //         notEmpty: {
  //             msg: "Avatar nhân viên không được bỏ trống.",
  //         },
  //     },
  //     get() {
  //         return getDecrypt("avatar", this);
  //     },
  //     set(value) {
  //         setEncrypt(value, "avatar", this);
  //     },
  // },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Địa chỉ nhân viên không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("address", this);
    },
    set(value) {
      setEncrypt(value, "address", this);
    },
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Số điện thoại nhân viên không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("phone", this);
    },
    set(value) {
      setEncrypt(value, "phone", this);
    },
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Email nhân viên không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("email", this);
    },
    set(value) {
      setEncrypt(value, "email", this);
    },
  },
});

const Account = sequelize.define("Account", {
  _id: setPrimary,
  user_name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên đăng nhập không được bỏ trống.",
      },
    },
    validate: {
      notEmpty: {
        msg: "Mật khẩu không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("user_name", this);
    },
    set(value) {
      setEncrypt(value, "user_name", this);
    },
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return getDecrypt("password", this);
    },
    set(value) {
      setEncrypt(value, "password", this);
    },
  },
});

const Appointment = sequelize.define("Appointment", {
  _id: setPrimary,
  date_time: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày hẹn không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("date_time", this);
    },
    set(value) {
      setEncrypt(value, "date_time", this);
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Nội dung cuộc hẹn không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("content", this);
    },
    set(value) {
      setEncrypt(value, "content", this);
    },
  },
  note: {
    type: DataTypes.TEXT,
    get() {
      return getDecrypt("note", this);
    },
    set(value) {
      setEncrypt(value, "note", this);
    },
  },
  place: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Địa điểm cuộc hẹn không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("place", this);
    },
    set(value) {
      setEncrypt(value, "place", this);
    },
  },
});

const Status_Task = sequelize.define("Status_Task", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Status_App = sequelize.define("Status_App", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Evaluate = sequelize.define("Evaluate", {
  _id: setPrimary,
  star: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return getDecrypt("star", this);
    },
    set(value) {
      setEncrypt(value, "star", this);
    },
  },
});

const Comment = sequelize.define("Comment", {
  _id: setPrimary,
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return getDecrypt("content", this);
    },
    set(value) {
      setEncrypt(value, "content", this);
    },
  },
});

const Task = sequelize.define("Task", {
  _id: setPrimary,
  start_date: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày bắt đầu không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("start_date", this);
    },
    set(value) {
      setEncrypt(value, "start_date", this);
    },
  },
  end_date: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày kết thúc không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("end_date", this);
    },
    set(value) {
      setEncrypt(value, "end_date", this);
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Nội dung không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("content", this);
    },
    set(value) {
      setEncrypt(value, "content", this);
    },
  },
  note: {
    type: DataTypes.TEXT,
    get() {
      return getDecrypt("note", this);
    },
    set(value) {
      setEncrypt(value, "note", this);
    },
  },
});

const Log = sequelize.define("Log", {
  _id: setPrimary,
  created_at: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return getDecrypt("created_at", this);
    },
    set(value) {
      setEncrypt(value, "created_at", this);
    },
  },
  created_user: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return getDecrypt("created_user", this);
    },
    set(value) {
      setEncrypt(value, "created_user", this);
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return getDecrypt("content", this);
    },
    set(value) {
      setEncrypt(value, "content", this);
    },
  },
});

const Notification = sequelize.define("Notification", {
  _id: setPrimary,
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tiêu đề thông báo không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("title", this);
    },
    set(value) {
      setEncrypt(value, "title", this);
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Nội dung thông báo không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("content", this);
    },
    set(value) {
      setEncrypt(value, "content", this);
    },
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  recipient: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Người nhận không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("recipient", this);
    },
    set(value) {
      setEncrypt(value, "recipient", this);
    },
  },
  sender: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return getDecrypt("sender", this);
    },
    set(value) {
      setEncrypt(value, "sender", this);
    },
  },
  idRecipient: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// relationships

//one-to-many relationships

// checked
Customer_Types.hasMany(Customer, {
  foreignKey: "customerTypesId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Customer.belongsTo(Customer_Types, {
  foreignKey: "customerTypesId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Customer.hasMany(Customer_Work, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Customer_Work.belongsTo(Customer, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Customer.hasMany(Task, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Task.belongsTo(Customer, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Company_KH.hasMany(Customer_Work, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Customer_Work.belongsTo(Company_KH, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Cycle.hasMany(Task, {
  foreignKey: "cycleId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Task.belongsTo(Cycle, {
  foreignKey: "cycleId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Employee.hasMany(Task, {
  foreignKey: "leaderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Task.belongsTo(Employee, {
  foreignKey: "leaderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Task.hasMany(Appointment, {
  foreignKey: "taskId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Appointment.belongsTo(Task, {
  foreignKey: "taskId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Position.hasMany(Employee, {
  foreignKey: "postionId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Employee.belongsTo(Position, {
  foreignKey: "postionId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Unit.hasMany(Employee, {
  foreignKey: "unitId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Employee.belongsTo(Unit, {
  foreignKey: "unitId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Department.hasMany(Unit, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Unit.belongsTo(Department, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Center_VNPTHG.hasMany(Department, {
  foreignKey: "centerVNPTHGId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Department.belongsTo(Center_VNPTHG, {
  foreignKey: "centerVNPTHGId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Role.hasMany(Account, {
  foreignKey: "roleId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Account.belongsTo(Role, {
  foreignKey: "roleId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Status_Task.hasMany(Task, {
  foreignKey: "StatusTaskId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Task.belongsTo(Status_Task, {
  foreignKey: "StatusTaskId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Status_App.hasMany(Appointment, {
  foreignKey: "StatusAppId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Appointment.belongsTo(Status_App, {
  foreignKey: "StatusAppId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Evaluate.hasMany(Task, {
  foreignKey: "EvaluateId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Task.belongsTo(Evaluate, {
  foreignKey: "EvaluateId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Permission_Types.hasMany(Permission, {
  foreignKey: "permissionTypesId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Permission.belongsTo(Permission_Types, {
  foreignKey: "permissionTypesId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// many-to-many relationship

// checked
const Customer_Event = sequelize.define("Customer_Event", {});
Customer.belongsToMany(Event, {
  through: Customer_Event,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Event.belongsToMany(Customer, {
  through: Customer_Event,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
const Customer_Habit = sequelize.define("Customer_Habit", {});
Customer.belongsToMany(Habit, {
  through: Customer_Habit,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Habit.belongsToMany(Customer, {
  through: Customer_Habit,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
const Employee_Task = sequelize.define("Employee_Task", {});
Employee.belongsToMany(Task, {
  through: Employee_Task,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Task.belongsToMany(Employee, {
  through: Employee_Task,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
const Role_Permission = sequelize.define("Role_Permission", {});
Role.belongsToMany(Permission, {
  through: Role_Permission,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Permission.belongsToMany(Role, {
  through: Role_Permission,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// one-to-one relationship
// checked
Employee.hasOne(Account, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Account.belongsTo(Employee, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// checked
Task.hasOne(Comment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Comment.belongsTo(Task, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Sync the model with the database
Customer_Types.sync();
Customer.sync({});
Customer_Work.sync();
Company_KH.sync();
Event.sync({});
Habit.sync();
Position.sync();
Center_VNPTHG.sync();
Department.sync();
Unit.sync();
Permission_Types.sync();
// alter: true
Permission.sync({});
Role.sync({});
Cycle.sync();
Employee.sync();
Account.sync();
Appointment.sync();
Task.sync();
Log.sync();
Evaluate.sync();
Comment.sync();
Status_App.sync();
Status_Task.sync();
Customer_Event.sync();
Customer_Habit.sync();
Employee_Task.sync();
Role_Permission.sync();
Notification.sync();

module.exports = {
  Customer_Types,
  Customer,
  Customer_Work,
  Company_KH,
  Event,
  Habit,
  Position,
  Center_VNPTHG,
  Department,
  Unit,
  Permission,
  Role,
  Cycle,
  Employee,
  Account,
  Appointment,
  Task,
  Log,
  Customer_Event,
  Customer_Habit,
  Employee_Task,
  Role_Permission,
  Status_App,
  Status_Task,
  Evaluate,
  Comment,
  Notification,
  Permission_Types,
};
