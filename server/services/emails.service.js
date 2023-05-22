import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain };
import Models from "../models";
import nodeMailer from "nodemailer";
import { leadStatus } from "../common/enum";
const fs = require("fs");

// create template
const createTemplate = async (data) => {
  let responseData = statusConst.error;
  try {
    const userPayload = {
      content: data.content || "",
      subject: data.subject || "",
      sincerely: data.sincerely || "",
      status: leadStatus.PENDING || "",
      created_at: new Date(),
      updated_at: new Date(),
    };
    const user = await Models.themes.create(userPayload, { raw: true });
    if (!user) {
      throw new Error("Unable to create new template");
    }
    responseData = {
      status: 200,
      message: "template data created successfully",
    };
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

const emailSent = async (data, id) => {
  let responseData = statusConst.error;
  try {
    let emailUser = await Models.leads.findAll({
      where: { status: leadStatus.PENDING },
    });
    let emailList = emailUser.map((lead) => lead.dataValues.email);
    let statusUpdate = emailUser.map((lead) => lead.dataValues.status);

    let getTheams = await Models.themes.findOne({ where: { id: id } });
    const getContent = getTheams.dataValues.content;
    const getSincerely = getTheams.dataValues.sincerely;
    const getSubject = getTheams.dataValues.subject;
    const getDate = new Date().toLocaleDateString("en-US");

    // Loop through the email list and send emails
    for (let [index, email] of emailList.entries()) {
      // Update status
      await Models.leads.update(
        { status: leadStatus.ACKNOWLEDGE },
        { where: { email } }
      );
      statusUpdate[index] = leadStatus.ACKNOWLEDGE;

      // Send email
      await emailTemplateMail(email,getSincerely,getContent,getSubject,getDate);
    }
    responseData = statusConst.success;
  } catch (error) {
    responseData = { status: 404, message: error.message };
  }
  return responseData;
};

const emailTemplateMail = async (email, getSincerely,getContent,getSubject,getDate) => {
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "aniket.bediskar.5057@gmail.com",
      pass: "rvbbvzbwrgkllhip",
    },
  });

  // Read the HTML template file
  const emailTemplate = fs.readFileSync("template.html", "utf8");

  // Replace placeholders with dynamic values
  const htmlContent = emailTemplate
    .replace("${getSincerely}", getSincerely)
    .replace("${getContent}", getContent)
    .replace("${getSubject}", getSubject)
    .replace("${getDate}", getDate);

  await transporter.sendMail({
    from: "aniket.bediskar.5057@gmail.com",
    to: email,
    subject: getSubject,
    html: htmlContent,
  });
};

const UserServices = {
  emailSent,
  createTemplate,
};

export default UserServices;