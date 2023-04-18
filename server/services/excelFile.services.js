import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain };
import Models from "../models";
import appConfig from "../common/appConfig";
import { leadStatus } from "../common/enum";
import dbHelper from "../common/dbHelper";
import msgConst from "../common/msgConstants";
import { FILE_DIR } from "../common/appConstants";
import { fileStatus } from "../common/enum";
import fs from "fs";
import reader from "xlsx";
// Create User
const uploadFile = async (req) => {
  let responseData = statusConst.error;
  try {
    if (req.files) {
      //Set file name and upload path to upload File
      const fileSize = Object.keys(req.files).length;
      console.log("fileSize===>", fileSize);
      const file = req.files.file;
      const fileName = `excel-${Date.now().toString()}.${
        "xlsx".split("/")[1] || "xlsx"
      }`;
      const filePath = `${FILE_DIR}${fileName}`;
      console.log("filePath====>", filePath);
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
    console.log("${FILE_DIR}${fileName}==>", `${FILE_DIR}${fileName}`);
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
      validLeads.push(row);
      totalValidRecords = totalValidRecords + 1;
    }
  });
    const fileDetails =  await Models.fileDetails.findOne({
      where: {
        id: fileId,
      },
    })
   if (!_.isEmpty(fileDetails)) {
    await fileDetails.update({total_records:totalRecords,total_valid_records:totalValidRecords},{where: {id: fileId,}});
   }
  if (validLeads.length > 0) {
    await Models.leads.bulkCreate(validLeads);
  }
};
const ExcelServices = {
  uploadFile,
  readFile,
  sheetToJson,
};

export default ExcelServices;
