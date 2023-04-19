import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain };
import Models from "../models";
import dbHelper from "../common/dbHelper";
import {leadStatus } from "../common/enum";

const count = async (data) => {
  let responseData = statusConst.error;
  try {
      const data = await Models.leads.findAll();
      let totalLeads = 0;
      let proceedLeads = 0;
      if (data && data.length > 0 ) {
        data.forEach(({dataValues}) => {
          totalLeads = totalLeads +1;
          if (dataValues?.status === leadStatus.PROCEED) {
            proceedLeads = proceedLeads +1;
          }
        });
      }
      const res = {totalLeads: totalLeads,proceedLeads:proceedLeads}
      responseData = { status: 200, res};


  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };

    if (["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(error.name)) {
      errors = dbHelper.formatSequelizeErrors(error);
      responseData = { status: 422, message: 'Unable to process form request', errors };
    } else {
      responseData = { status: 400, message: error.message };;
    }
  }
  return responseData;
};








const LeadServices = {
  count,
};

export default LeadServices;