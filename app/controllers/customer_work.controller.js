const {
  Customer_Types,
  Customer_Work,
  Customer,
  Company_KH,
  Task,
  Status_Task,
  Event,
  Habit,
  Evaluate,
  Comment,
  Cycle,
} = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

// "customerId" : "1",
// "current_workplace" : "2",
// "work_history" : "4",
// "current_position" : "3",
// "work_temp" : "5",
// "companyId" : "7"
exports.create = async (req, res, next) => {
  try {
    const document = await Customer_Work.create({
      ...req.body,
    });

    return res.status(200).json({
      msg: document ? "Tạo thành công" : "Tạo thất bại",
      error: document ? false : true,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

// Evaluate,
// Comment,
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Customer_Work.findAll({
      include: [
        {
          model: Customer,
          include: [
            {
              model: Task,
              include: [
                {
                  model: Status_Task,
                },
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
            {
              model: Customer_Types,
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
          model: Company_KH,
        },
      ],
    });

    return res.status(200).json({
      msg: documents.length > 0 ? "Danh sách công việc khách hàng!!" : "Trống",
      error: documents.length > 0 ? false : true,
      documents: documents.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      ),
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const documents = await Customer_Work.findOne({
      include: [
        {
          model: Customer,
          include: [
            {
              model: Customer_Types,
            },
          ],
        },
      ],
      where: {
        _id: id,
      },
    });

    return res.status(200).json({
      msg: documents ? "Find customer work" : "Not found!!",
      statusCode: documents ? true : false,
      payload: documents ? documents : undefined,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await Customer_Work.destroy({
      where: {
        _id: id,
      },
    });

    return res.status(200).json({
      msg: document
        ? "Xóa thành công!!!"
        : "Không tìm thấy khách hàng để xóa!!!",
      error: document ? false : true,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await Customer_Work.update(
      {
        ...req.body,
      },
      {
        where: {
          _id: id,
        },
      }
    );

    return res.status(200).json({
      msg: document[0]
        ? "Sửa dử liệu thành công"
        : "Không tìm thấy thông tin để sửa",
      error: document[0] ? false : true,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
