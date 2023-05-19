import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain };
import Models from "../models";
import appConfig from "../common/appConfig";
import nodeMailer from "nodemailer";
import { leadStatus } from "../common/enum";

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
      responseData = {status: 200,message: "template data created successfully"};
    } catch (error) {
      let errors = {};
      responseData = { status: 400, message: error.message };
      if (
        ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
          error.name
        )
      ) {
        errors = dbHelper.formatSequelizeErrors(error);
        responseData = { status: 422,message: "Unable to process form request", errors};
      } else {
        responseData = { status: 400, message: error.message };
      }
    }
    return responseData;
};

const emailSent = async (data, id) => {
    let responseData = statusConst.error;
    try {
      let emailUser = await Models.leads.findAll({ where: { status: leadStatus.PENDING } });
      let emailList = emailUser.map((lead) => lead.dataValues.email);

      let getTheams = await Models.themes.findOne({ where: { id: id}});
      const getContent =  getTheams.dataValues.content;
      const getSincerely =  getTheams.dataValues.sincerely;
      const getSubject =  getTheams.dataValues.subject;


      // Loop through the email list and send emails
      for (let email of emailList) {
        await emailTemplateMail(email,getSincerely,getContent,getSubject,new Date().toISOString());
      }
      responseData = statusConst.success;
    } catch (error) {
      responseData = { status: 404, message: error.message };
    }
    return responseData;
  };
  
  const emailTemplateMail = async (email,getSincerely,getContent,getSubject) => {
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "aniket.bediskar.5057@gmail.com",
        pass: "rvbbvzbwrgkllhip",
      },
    });
  
    await transporter.sendMail({
      from: "aniket.bediskar.5057@gmail.com",
      to: email,
      subject: getSubject,
      html: `
        <p>Dear employee,</p>
        <p>Greetings from ${getContent}!</p>
        <p>This is a sample email template.</p>
        <p>Created on: </p>
        <p>Best regards,</p>
        <p>${getSincerely}</p>
      `,
    });
  };
  
// sent email
// const emailSent = async (data) => {
//   let responseData = statusConst.error;
//   try {

//     let emailUser = await Models.leads.findAll({ where : { status: leadStatus.PENDING} });
//     let emailList = emailUser.map((lead) => lead.dataValues.email);
//     console.log("emailList------------------->", emailList);

//   } catch (error) {
//     responseData = { status: 404, message: error.message };
//   }
//   return responseData;
// };

// sent Email
// const emailTemplateMail = async (email ,emailSincerely ,userName ,emailSubject ,createDate) => {
//   let transporter = nodeMailer.createTransport({
//     service: "gmail",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "aniket.bediskar.5057@gmail.com",
//       pass: "rvbbvzbwrgkllhip",
//     },
//   });

//   await transporter.sendMail({
//     from: "aniket.bediskar.5057@gmail.com",
//     to: email,
//     subject: emailSubject,
//     html: "",
//   });
// };

const sendTemplate = async (data) => {
    let responseData = statusConst.error;
    try {
      
    } catch (error) {
    
    }
    return responseData;
  };
  
const UserServices = {
  emailSent,
  createTemplate,
  sendTemplate
};

export default UserServices;
