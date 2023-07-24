//socket
const notification = require("./app/controllers/notification.controller");
const {
  Notification,
  Event,
  Customer_Event,
} = require("./app/models/index.model");

// npm packages
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const bcrypt = require("bcryptjs");

//mail
const nodemailer = require("nodemailer");
//socket
const moment = require("moment");
//len lich
const cron = require("node-cron");

// initialize
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//socket
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const {
  Account,
  Role,
  Employee,
  Permission,
} = require("./app/models/index.model");

const sendMail = async (email, name, age) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maxvolum2012@gmail.com",
      pass: "wisbbpolajrseqqd",
    },
  });

  const mailOptions = {
    from: "maxvolum2012@gmail.com",
    to: email,
    subject: "Chúc mừng sinh nhật",
    html: `Dear ${name}!
            <br> Chúc mừng sinh nhật lần thứ ${age} của bạn`,
  };

  await transporter.sendMail(mailOptions);
};

const DatetimeEvent = async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const currentDay = ("0" + currentDate.getDate()).slice(-2);
  const currentHour = ("0" + currentDate.getHours()).slice(-2);
  const currentMinute = ("0" + currentDate.getMinutes()).slice(-2);

  const datetimeLocalFormat =
    `${currentYear}-${currentMonth}-${currentDay}T${currentHour}:${currentMinute}` +
    " to " +
    `${currentYear}-${currentMonth}-${currentDay}T23:59`;
  // const formattedDateTime = currentDate.toISOString();
  return datetimeLocalFormat;
};
const getTimeEvent = async (value) => {
  value.time_duration = value.time_duration.split(" to ")[0];
  var time_duration = new Date(value.time_duration);
  var ngay = time_duration.getDate();
  var thang = time_duration.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
  var nam = time_duration.getFullYear();
  var timeEvent = ngay + "/" + thang + "/" + nam;
  return timeEvent;
};
const getCurrent = async () => {
  var ngayHienTai = new Date();
  var ngay = ngayHienTai.getDate();
  var thang = ngayHienTai.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
  var nam = ngayHienTai.getFullYear();
  var current = ngay + "/" + thang + "/" + nam;
  return current;
};

const createCusEvent = async (customer, value) => {
  await Customer_Event.create({
    CustomerId: customer._id,
    EventId: value._id,
  });
};

const createNoti = async (customerBirthday, age, customer, _id, nameEm) => {
  await Notification.create({
    title: "Sinh nhật",
    content: `Ngày mai ${customerBirthday.date}/${
      customerBirthday.month + 1
    } là sinh nhật thứ ${age} của khách hàng "${customer.name}"`,
    recipient: nameEm,
    sender: "",
    isRead: false,
    idRecipient: _id,
  });
};

const createEvent = async (time) => {
  const event = await Event.create({
    name: "sinh nhật",
    content: "sinh nhật",
    time_duration: time,
  });
  return event;
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  cron.schedule("31 21 * * *", () => {
    socket.emit("notiEveryDay");
  });

  socket.on("assignmentTask", () => {
    io.emit("notiTask");
  });

  socket.on("reAssign", async (notiAssignment) => {
    await Notification.create(notiAssignment);
  });

  socket.on("cancleAssign", async (notiAssignment) => {
    await Notification.create(notiAssignment);
  });

  socket.on("Assign", async (notiAssignment) => {
    await Notification.create(notiAssignment);
  });

  socket.on("Work", async (notiAssignment) => {
    await Notification.create(notiAssignment);
  });

  socket.on("birthday", async (customers, _id, nameEm) => {
    const today = moment(); // Lấy ngày hiện tại
    for (const customer of customers) {
      const birthday = moment(customer.birthday, "YYYY-MM-DD");
      const customerBirthday = {
        year: birthday.year(),
        month: birthday.month(),
        date: birthday.date(),
      };
      const todayDate = {
        year: today.year(),
        month: today.month(),
        date: today.date(),
      };
      const age = todayDate.year - customerBirthday.year;
      if (
        todayDate.month === customerBirthday.month &&
        todayDate.date === customerBirthday.date - 1
      ) {
        const documents = await Notification.findAll({
          where: {
            idRecipient: _id,
          },
        });
        let count = 0;
        if (documents.length > 0) {
          for (const value of documents) {
            if (
              value.title == "Sinh nhật" &&
              value.content ==
                `Ngày mai ${customerBirthday.date}/${
                  customerBirthday.month + 1
                } là sinh nhật thứ ${age} của khách hàng "${customer.name}"`
            ) {
              count++;
            }
          }
          if (count > 0) {
            io.emit("notiTask");
          } else {
            await createNoti(customerBirthday, age, customer, _id, nameEm);
            io.emit("notiTask");
            /////event
            const events = await Event.findAll();
            if (events.length > 0) {
              let temp = 0;
              for (let value of events) {
                var timeEvent = await getTimeEvent(value);
                var current = await getCurrent();
                if (value.name == "sinh nhật" && timeEvent == current) {
                  temp++;
                  ////// có sự kiện r thì thêm khách hàng dô
                  ////Cus_event
                  const cusEvent = await Customer_Event.findAll();
                  if (cusEvent.length > 0) {
                    let count = 0;
                    for (let val of cusEvent) {
                      if (
                        val.CustomerId == customer._id &&
                        val.EventId == value._id
                      ) {
                        count++;
                        break;
                      }
                    }
                    if (count == 0) {
                      await createCusEvent(customer, value);
                    }
                  } else {
                    await createCusEvent(customer, value);
                  }
                }
              }
              if (temp == 0) {
                const datetimeLocalFormat = await DatetimeEvent();
                const docevent = await createEvent(datetimeLocalFormat);
                ////Cus_event
                const cusEvent = await Customer_Event.findAll();
                if (cusEvent.length > 0) {
                  let count = 0;
                  for (let val of cusEvent) {
                    if (
                      val.CustomerId == customer._id &&
                      val.EventId == docevent._id
                    ) {
                      count++;
                      break;
                    }
                  }
                  if (count == 0) {
                    await createCusEvent(customer, docevent);
                  }
                } else {
                  await createCusEvent(customer, docevent);
                }
              }
            } else {
              const datetimeLocalFormat = await DatetimeEvent();
              const document = await createEvent(datetimeLocalFormat);
              ////Cus_event
              const cusEvent = await Customer_Event.findAll();
              if (cusEvent.length > 0) {
                let count = 0;
                for (let val of cusEvent) {
                  if (
                    val.CustomerId == customer._id &&
                    val.EventId == document._id
                  ) {
                    count++;
                    break;
                  }
                }
                if (count == 0) {
                  await createCusEvent(customer, document);
                }
              } else {
                await createCusEvent(customer, document);
              }
            }
            if (customer.email != "Chưa cập nhật") {
              await sendMail(customer.email, customer.name, age);
            }
          }
        } else {
          await createNoti(customerBirthday, age, customer, _id, nameEm);
          io.emit("notiTask");
          /////event
          const events = await Event.findAll();
          if (events.length > 0) {
            let temp = 0;
            for (let value of events) {
              var timeEvent = await getTimeEvent(value);
              var current = await getCurrent();
              if (value.name == "sinh nhật" && timeEvent == current) {
                temp++;
                ////// có sự kiện r thì thêm khách hàng dô
                ////Cus_event
                const cusEvent = await Customer_Event.findAll();
                if (cusEvent.length > 0) {
                  let count = 0;
                  for (let val of cusEvent) {
                    if (
                      val.CustomerId == customer._id &&
                      val.EventId == value._id
                    ) {
                      count++;
                      break;
                    }
                  }
                  if (count == 0) {
                    await createCusEvent(customer, value);
                  }
                } else {
                  await createCusEvent(customer, value);
                }
              }
            }
            if (temp == 0) {
              const datetimeLocalFormat = await DatetimeEvent();
              const docevent = await createEvent(datetimeLocalFormat);
              ////Cus_event
              const cusEvent = await Customer_Event.findAll();
              if (cusEvent.length > 0) {
                let count = 0;
                for (let val of cusEvent) {
                  if (
                    val.CustomerId == customer._id &&
                    val.EventId == docevent._id
                  ) {
                    count++;
                    break;
                  }
                }
                if (count == 0) {
                  await createCusEvent(customer, docevent);
                }
              } else {
                await createCusEvent(customer, docevent);
              }
            }
          } else {
            const datetimeLocalFormat = await DatetimeEvent();
            const document = await createEvent(datetimeLocalFormat);
            ////Cus_event
            const cusEvent = await Customer_Event.findAll();
            if (cusEvent.length > 0) {
              let count = 0;
              for (let val of cusEvent) {
                if (
                  val.CustomerId == customer._id &&
                  val.EventId == document._id
                ) {
                  count++;
                  break;
                }
              }
              if (count == 0) {
                await createCusEvent(customer, document);
              }
            } else {
              await createCusEvent(customer, document);
            }
          }
          if (customer.email != "Chưa cập nhật") {
            await sendMail(customer.email, customer.name, age);
          }
          io.emit("notiTask");
        }
      }
    }
  });

  socket.on("cycleCus", async (Tasks) => {
    for (const value of Tasks) {
      if (value.Status_Task.name == "đã chăm sóc") {
        const today = moment();
        const todayDate = {
          year: today.year(),
          month: today.month(),
          date: today.date(),
        };
        const start_day = moment(value.start_date, "YYYY-MM-DD");
        let end_day = moment(value.end_date, "YYYY-MM-DD");
        value.end_date = moment(value.end_date, "YYYY-MM-DD");
        let coming_day = start_day;
        if (start_day.isBefore(today)) {
          var parts = value.Cycle.name.split(" ");
          var number = parseInt(parts[0]);
          var string = parts[1];
          switch (string) {
            case "ngày":
              coming_day = coming_day.add(number, "days");
              end_day = end_day.add(number, "days");
              break;
            case "tuần":
              coming_day = coming_day.add(number * 7, "days");
              end_day = end_day.add(number * 7, "days");
              break;
            case "tháng":
              coming_day = coming_day.add(number, "months");
              end_day = end_day.add(number, "months");
              break;
            case "quý":
              coming_day = coming_day.add(number * 3, "months");
              end_day = end_day.add(number * 3, "months");
              break;
            case "năm":
              coming_day = coming_day.add(number, "years");
              end_day = end_day.add(number, "years");
              break;
            default:
              console.log("Chu kì k hợp lệ");
              break;
          }
          for (const i of Tasks) {
            if (
              value.Customer._id == i.Customer._id &&
              value.Employees.length != 0
            ) {
              const start_dateItem = moment(i.start_date, "YYYY-MM-DD");
              const end_dateItem = moment(i.end_date, "YYYY-MM-DD");
              if (coming_day.isSame(value.end_date)) {
                if (
                  start_dateItem.isSame(coming_day.add(1, "days")) &&
                  end_dateItem.isSame(end_day.add(1, "days"))
                ) {
                  coming_day = start_dateItem;
                  value.Employees = i.Employees;
                  value.content = i.content;
                }
              } else if (
                start_dateItem.isSame(coming_day) &&
                end_dateItem.isSame(end_day)
              ) {
                coming_day = start_dateItem;
                value.Employees = i.Employees;
                value.content = i.content;
              }
            }
          }
          today.startOf("day");
          coming_day.startOf("day");
          if (coming_day.isSame(value.end_date)) {
            coming_day = coming_day.add(1, "days");
            end_day = end_day.add(1, "days");
          }
          if (coming_day.subtract(1, "days").isSame(today)) {
            if (!value.Employees.length) {
              const notice = await Notification.findAll({
                where: {
                  idRecipient: value.leaderId,
                },
              });
              let count = 0;
              if (notice.length > 0) {
                for (const item of notice) {
                  if (
                    item.title == "Phân công chưa được giao" &&
                    item.content ==
                      `Ngày mai ${todayDate.date + 1}/${
                        todayDate.month + 1
                      } là chu kỳ chăm sóc "${
                        value.Cycle.name
                      }" của khách hàng "${
                        value.Customer.name
                      }" với nội dung chăm sóc: ${value.content}`
                  ) {
                    count++;
                  }
                }
                if (count > 0) {
                  io.emit("notiTask");
                } else {
                  await Notification.create({
                    title: "Phân công chưa được giao",
                    content: `Ngày mai ${todayDate.date + 1}/${
                      todayDate.month + 1
                    } là chu kỳ chăm sóc "${
                      value.Cycle.name
                    }" của khách hàng "${
                      value.Customer.name
                    }" với nội dung chăm sóc: ${value.content}`,
                    recipient: "Lãnh đạo",
                    sender: "",
                    isRead: false,
                    idRecipient: value.leaderId,
                  });
                  io.emit("notiTask");
                }
              } else {
                await Notification.create({
                  title: "Phân công chưa được giao",
                  content: `Ngày mai ${todayDate.date + 1}/${
                    todayDate.month + 1
                  } là chu kỳ chăm sóc "${value.Cycle.name}" của khách hàng "${
                    value.Customer.name
                  }" với nội dung chăm sóc: ${value.content}`,
                  recipient: "Lãnh đạo",
                  sender: "",
                  isRead: false,
                  idRecipient: value.leaderId,
                });
                const notice = await Notification.findAll({
                  where: {
                    idRecipient: value.leaderId,
                  },
                });
                io.emit("notiTask");
              }
            } else {
              const documents = await Notification.findAll({
                where: {
                  idRecipient: value.leaderId,
                },
              });
              let count = 0;
              if (documents.length >= 0) {
                for (const item of documents) {
                  if (
                    item.title == "Tới chu kỳ" &&
                    item.content ==
                      `Ngày mai ${todayDate.date + 1}/${
                        todayDate.month + 1
                      } là chu kỳ chăm sóc "${
                        value.Cycle.name
                      }" của khách hàng "${
                        value.Customer.name
                      }" với nội dung chăm sóc: ${value.content}`
                  ) {
                    count++;
                  }
                }
                if (count > 0) {
                  io.emit("notiTask");
                } else {
                  await Notification.create({
                    title: "Tới chu kỳ",
                    content: `Ngày mai ${todayDate.date + 1}/${
                      todayDate.month + 1
                    } là chu kỳ chăm sóc "${
                      value.Cycle.name
                    }" của khách hàng "${
                      value.Customer.name
                    }" với nội dung chăm sóc: ${value.content}`,
                    recipient: "Lãnh đạo",
                    sender: "",
                    isRead: false,
                    idRecipient: value.leaderId,
                  });
                  io.emit("notiTask");
                }
              } else {
                await Notification.create({
                  title: "Tới chu kỳ",
                  content: `Ngày mai ${todayDate.date + 1}/${
                    todayDate.month + 1
                  } là chu kỳ chăm sóc "${value.Cycle.name}" của khách hàng "${
                    value.Customer.name
                  }" với nội dung chăm sóc: ${value.content}`,
                  recipient: "Lãnh đạo",
                  sender: "",
                  isRead: false,
                  idRecipient: value.leaderId,
                });
                io.emit("notiTask");
              }
            }
          }
        }
      }
    }
  });

  socket.on("lateCus", async (Tasks) => {
    for (const value of Tasks) {
      if (value.Status_Task.name == "đã chăm sóc") {
        let start_day = moment(value.start_date, "YYYY-MM-DD");
        let end_day = moment(value.end_date, "YYYY-MM-DD");
        let formatted_end = end_day.format("DD-MM-YYYY");
        let end_dayold = moment(value.end_date, "YYYY-MM-DD");
        let countC = 0;
        let shouldBreak = false;
        while (end_day.isBefore(moment(), "day") && !shouldBreak) {
          var parts = value.Cycle.name.split(" ");
          var number = parseInt(parts[0]);
          var string = parts[1];
          switch (string) {
            case "ngày":
              start_day = start_day.add(number, "days");
              end_day = end_day.add(number, "days");
              break;
            case "tuần":
              start_day = start_day.add(number * 7, "days");
              end_day = end_day.add(number * 7, "days");
              break;
            case "tháng":
              start_day = start_day.add(number, "months");
              end_day = end_day.add(number, "months");
              break;
            case "quý":
              start_day = start_day.add(number * 3, "months");
              end_day = end_day.add(number * 3, "months");
              break;
            case "năm":
              start_day = start_day.add(number, "years");
              end_day = end_day.add(number, "years");
              break;
            default:
              console.log("Chu kỳ không hợp lệ");
              break;
          }
          if (start_day.isSame(end_dayold)) {
            end_dayold = end_day;
            start_day = start_day.add(1, "days");
            end_day = end_day.add(1, "days");
          }
          countC++;
          for (const i of Tasks) {
            if (start_day.isSame(i.start_date) && end_day.isSame(i.end_date)) {
              shouldBreak = true;
              break;
            }
          }
        }
        if (countC > 2) {
          let count = 0;
          const notice = await Notification.findAll({
            where: {
              idRecipient: value.leaderId,
            },
          });
          if (notice.length > 0) {
            for (const item of notice) {
              if (
                item.title == "Cảnh báo" &&
                item.content ==
                  `Khách hàng "${value.Customer.name}" đã lâu chưa được chăm sóc kể từ ngày ${formatted_end}`
              ) {
                count++;
              }
            }
            if (count > 0) {
              io.emit("notiTask");
            } else {
              await Notification.create({
                title: "Cảnh báo",
                content: `Khách hàng "${value.Customer.name}" đã lâu chưa được chăm sóc kể từ ngày ${formatted_end}`,
                recipient: "Lãnh đạo",
                sender: "",
                isRead: false,
                idRecipient: value.leaderId,
              });
              io.emit("notiTask");
            }
          } else {
            await Notification.create({
              title: "Cảnh báo",
              content: `Khách hàng "${value.Customer.name}" đã lâu chưa được chăm sóc kể từ ngày ${formatted_end}`,
              recipient: "Lãnh đạo",
              sender: "",
              isRead: false,
              idRecipient: value.leaderId,
            });
            io.emit("notiTask");
          }
        }
      }
    }
  });
});

server.listen(3000, () => {
  console.log(`Server is listening on port`);
});

// config path
const pathPublic = path.join(__dirname, "./app/public");
app.use("/public", express.static(pathPublic));

// simple route
app.get("/", (req, res, next) => {
  return res.send({
    message: "Welcom to Personal CRM System",
  });
});

// handles before https methods
const convertToLowercase = (req, res, next) => {
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].toLowerCase();
    }
  }
  next();
};
const createAccount = async (req, res, next) => {
  // console.log("Create Account");
  const accounts = await Account.findAll();
  const username = "admin";
  const password = "admin";
  let isCheckUser = false;
  for (let value of accounts) {
    if (value.user_name == username) {
      isCheckUser = true;
      break;
    }
  }

  if (!isCheckUser) {
    console.log("isCheckUser");
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const document = await Account.create({
        user_name: username,
        password: hashedPassword,
      });
      next();
    } catch (error) {
      console.log(error.message);
      next();
    }
  }
  next();
};

app.use(createAccount);
app.use(convertToLowercase);

// initialize router
const customerRouter = require("./app/routes/customer.route");
const customer_typesRouter = require("./app/routes/customer_types.route");
const customer_workRouter = require("./app/routes/customer_work.route");
const Company_KHRouter = require("./app/routes/company_KH.route");
const EventRouter = require("./app/routes/event.route");
const HabitRouter = require("./app/routes/habit.route");
const PositionRouter = require("./app/routes/position.route");
const Center_VNPTHGRouter = require("./app/routes/center_VNPTHG.route");
const DepartmentRouter = require("./app/routes/department.route");
const UnitRouter = require("./app/routes/unit.route");
const PermissionRouter = require("./app/routes/permission.route");
const RoleRouter = require("./app/routes/role.route");
const CycleRouter = require("./app/routes/cycle.route");
const EmployeeRouter = require("./app/routes/employee.route");
const AccountRouter = require("./app/routes/account.route");
const AppointmentRouter = require("./app/routes/appointment.route");
const TaskRouter = require("./app/routes/task.route");
const LogRouter = require("./app/routes/log.route");
const Role_PermissionRouter = require("./app/routes/role_permission.route");
const Customer_EventRouter = require("./app/routes/customer_event.route");
const Customer_HabitRouter = require("./app/routes/customer_habit.route");
const Task_EmployeeRouter = require("./app/routes/task_employee.route");
const MailRouter = require("./app/routes/mail.route");
const LoginRouter = require("./app/routes/login.route");
const Status_TaskRouter = require("./app/routes/status_task.route");
const EvaluateRouter = require("./app/routes/evaluate.route");
const Status_AppRouter = require("./app/routes/status_app.route");
const notificationRouter = require("./app/routes/notification.route");
const permissionTypesRouter = require("./app/routes/permission_types.route");

// use router
app.use("/api/customers", customerRouter);
app.use("/api/customer_types", customer_typesRouter);
app.use("/api/customer_works", customer_workRouter);
app.use("/api/company_khs", Company_KHRouter);
app.use("/api/events", EventRouter);
app.use("/api/habits", HabitRouter);
app.use("/api/positions", PositionRouter);
app.use("/api/center_vnpthgs", Center_VNPTHGRouter);
app.use("/api/departments", DepartmentRouter);
app.use("/api/units", UnitRouter);
app.use("/api/permissions", PermissionRouter);
app.use("/api/roles", RoleRouter);
app.use("/api/cycles", CycleRouter);
app.use("/api/employees", EmployeeRouter);
app.use("/api/accounts", AccountRouter);
app.use("/api/appointments", AppointmentRouter);
app.use("/api/tasks", TaskRouter);
app.use("/api/logs", LogRouter);
app.use("/api/role_permissions", Role_PermissionRouter);
app.use("/api/customer_events", Customer_EventRouter);
app.use("/api/customer_habits", Customer_HabitRouter);
app.use("/api/task_employees", Task_EmployeeRouter);
app.use("/api/mail", MailRouter);
app.use("/api/login", LoginRouter);
app.use("/api/status_tasks", Status_TaskRouter);
app.use("/api/evaluates", EvaluateRouter);
app.use("/api/status_apps", Status_AppRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/permission_types", permissionTypesRouter);

// // check errors
app.use((req, res, next) => {
  return next(createError(404, "Resource Not Found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// exports
module.exports = app;
