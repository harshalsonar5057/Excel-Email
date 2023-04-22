import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain };
import Models from "../models";
import appConfig from "../common/appConfig";
import dbHelper from "../common/dbHelper";
import Helper from "../common/helper";
import msgConst from "../common/msgConstants";
import { FILE_DIR } from "../common/appConstants";
import { fileStatus, leadStatus } from "../common/enum";
import fs from "fs";
import reader from "xlsx";
import cron from "node-cron";
import nodeMailer from "nodemailer";

// Create User
const uploadFile = async (req) => {
  const vender_id = req.body?.vender_id;
  let responseData = statusConst.error;
  try {
    if (req.files) {
      //Set file name and upload path to upload File
      const fileSize = Object.keys(req.files).length;
      const file = req.files.file;
      const fileName = `excel-${Date.now().toString()}.${
        "xlsx".split("/")[1] || "xlsx"
      }`;
      const filePath = `${FILE_DIR}${fileName}`;
      // Move excel file to file folder
      file.mv(filePath, (err) => {
        if (err) {
          responseData = {
            ...statusConst.error,
            message: msgConst.uploadFailed,
          };
        }
      });
      const payload = {
        fileName: fileName,
        status: fileStatus.PENDING,
        vender_id: vender_id,
        total_records:0,
        total_valid_records:0,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const fileDetails = await Models.fileDetails.create(payload, {
        raw: true,
      });
      responseData = {
        ...statusConst.success,
        fileName: fileName,
        id: fileDetails?.dataValues?.id,
      };
    }
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };

    if (
      ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
        error.name
      )
    ) {
      errors = dbHelper.formatSequelizeErrors(error);
      responseData = {
        status: 422,
        message: "Unable to process form request",
        errors,
      };
    } else {
      responseData = { status: 400, message: error.message };
    }
  }
  return responseData;
};

const readFile = async (req) => {
  let responseData = statusConst.error;
  try {
    const pendingFiles = await Models.fileDetails.findAll({
      where: {
        status: fileStatus.PENDING,
      },
    });
    const files = [];
 console.log("pendingFiles :",pendingFiles);
 if (pendingFiles.length <= 0) {
  responseData = { status: 200, message: "All Files are readed." };
 }
    pendingFiles.map((data) => {
      files.push(data.dataValues);
    });
    if (files.length > 0) {
      files.forEach((file) => {
        // Check if the file exists in the folder
        fs.access(FILE_DIR + file.fileName, fs.constants.F_OK, async (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`${file.fileName} exists in ${FILE_DIR}`);
          const data = await sheetToJson(file.fileName);
          if (data.length > 0) {
            await validateEmailsAndInsert(data, file?.id);
            await unlinkFile(FILE_DIR + file.fileName);
          }
        });
      });
      responseData = { status: 200, message: "File readed successfully." };
    }
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };

    if (
      ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
        error.name
      )
    ) {
      errors = dbHelper.formatSequelizeErrors(error);
      responseData = {
        status: 422,
        message: "Unable to process form request",
        errors,
      };
    } else {
      responseData = { status: 400, message: error.message };
    }
  }
  return responseData;
};

const sheetToJson = async (fileName) => {
  try {
    const file = reader.readFile(`${FILE_DIR}${fileName}`);
    let data = [];
    const sheets = file.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }
    return data;
  } catch (error) {
    return error;
  }
};

const validateEmailsAndInsert = async (emails, fileId) => {
  try {
    const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const validLeads = [];
    let totalRecords = 0;
    let totalValidRecords = 0;
    emails.forEach((row) => {
      totalRecords = totalRecords + 1;
      const isValidEmail = emailRegex.test(row?.Email);
      if (isValidEmail === true) {
        row["email"] = row.Email;
        row["title"] = row.Title;
        row["status"] = leadStatus.PENDING;
        row["created_at"] = new Date();
        row["updated_at"] = new Date();
        row["file_ref_id"] = fileId;
        validLeads.push(row);
        totalValidRecords = totalValidRecords + 1;
      }
    });
    const fileDetails = await Models.fileDetails.findOne({
      where: {
        id: fileId,
      },
    });
    if (!_.isEmpty(fileDetails)) {
      await fileDetails.update(
        {
          total_records: totalRecords,
          total_valid_records: totalValidRecords,
          status: fileStatus.PROCEED,
        },
        { where: { id: fileId } }
      );
    }
    if (validLeads.length > 0) {
      await Models.leads.bulkCreate(validLeads);
    }
  } catch (error) {
    throw error;
  }
};

const unlinkFile = async (filepath) => {
  fs.unlink(filepath, (err) => {
    if (err) console.log(err);
    else {
      console.log("\nDeleted file: ", filepath);
    }
  });
};

// cron.schedule('*/2 * * * *', async () => {
//   console.log('Running a task every minute');
//   const allPendingLeads = await Models.leads.findAll({where:{status:leadStatus.PENDING}});
//   console.log("allPendingLeads====>",allPendingLeads);
// });

const sendEmail = async (req) => {
  let responseData = statusConst.error;
  try {
    const allPendingLeads = await Models.leads.findAll({
      where: { status: leadStatus.PENDING },
    });
    const leads = [];
    const leadIds = [];
    if (allPendingLeads.length > 0) {
      allPendingLeads.forEach((lead) => {
        leads.push(lead.dataValues);
        leadIds.push(lead.dataValues?.id);
      });
    }
    if (leads.length > 0) {
      leads.map(async lead => {
        const mailRes =  await userCreateEmail(lead.email);
      })
    }
    await Models.leads.update({ status : leadStatus.PROCEED },{ where : { id : leadIds }});
    responseData = { status: 200, message: "Email send SuccessFully.",Ids:leadIds };
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };

    if (
      ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
        error.name
      )
    ) {
      errors = dbHelper.formatSequelizeErrors(error);
      responseData = {
        status: 422,
        message: "Unable to process form request",
        errors,
      };
    } else {
      responseData = { status: 400, message: error.message };
    }
  }
  return responseData;
};

const userCreateEmail = async (Email) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    secure: false,
    auth: {
      user: "aniket.bediskar.5057@gmail.com",
      pass: "rvbbvzbwrgkllhip",
    },
  });

 const res =  await transporter.sendMail({
    from: "aniket.bediskar.5057@gmail.com",
    to: Email,
    subject: "User login credentials",
    html: `<!doctype html>
    <html>
    </html>`,
  });

  return res;
};

const getPendingFile = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});

  try {
    const { offset, limit, pagination } = Helper.dataPagination(entityParams);

    const pendingFileDeatail = await Models.fileDetails.findAndCountAll({
      where: { status:  fileStatus.PENDING },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });

    if (pendingFileDeatail.rows.length > 0) {
      pagination["totalPages"] = Math.ceil(
        (pendingFileDeatail || pendingFileDeatail).count / pagination.pageSize
      );
      pagination["pageRecords"] = ((pendingFileDeatail || {}).rows || []).length || 0;

      responseData = {
        status: 200,
        message: "pending-File data fetch successfully",
        pagination,
        data: pendingFileDeatail,
        success: true,
      };
    } else {
      responseData = {
        status: 200,
        message: "pending-File data fetch successfully",
        pagination,
        data: pendingFileDeatail,
        success: true,
      };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};


const ExcelServices = {
  uploadFile,
  readFile,
  sheetToJson,
  sendEmail,
  getPendingFile
};

export default ExcelServices;
