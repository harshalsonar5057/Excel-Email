import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain };
import Models from "../models";
import dbHelper from "../common/dbHelper";
import Helper from "../common/helper";
import { leadStatus } from "../common/enum";

const count = async (data) => {
  let responseData = statusConst.error;
  try {
    const data = await Models.leads.findAll();
    let totalLeads = 0;
    let acknowledgeLeads = 0;
    if (data && data.length > 0) {
      data.forEach(({ dataValues }) => {
        totalLeads = totalLeads + 1;
        if (dataValues?.status === leadStatus.ACKNOWLEDGE) {
          acknowledgeLeads = acknowledgeLeads + 1;
        }
      });
    }
    const res = { totalLeads: totalLeads, acknowledgeLeads: acknowledgeLeads };
    responseData = { status: 200, res };
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

const getLeads = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});

  try {
    const { offset, limit, pagination } = Helper.dataPagination(entityParams);

    const leadDeatail = await Models.leads.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });

    if (leadDeatail.rows.length > 0) {
      pagination["totalPages"] = Math.ceil(
        (leadDeatail || leadDeatail).count / pagination.pageSize
      );
      pagination["pageRecords"] = ((leadDeatail || {}).rows || []).length || 0;

      responseData = {
        status: 200,
        message: "leads data fetch successfully",
        pagination,
        data: leadDeatail,
        success: true,
      };
    } else {
      responseData = {
        status: 200,
        message: "leads data fetch successfully",
        pagination,
        data: leadDeatail,
        success: true,
      };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const updateStatus = async (req) => {
  let responseData = statusConst.error;
  const { id } = req.params;
  try {
    const leads = await Models.leads.findOne({ where: { id: id } });
    if (!leads) {
      throw new Error("lead does not exist");
    } else {
      const leadData = _.get(leads,"dataValues",{});
      if (leadData.status ===leadStatus.PENDING) {
        throw new Error("lead is not proceed yet.");
      } 
      if (leadData.status ===leadStatus.ACKNOWLEDGE) {
        responseData = {
          status: 200,
          message: "lead status already updated.",
          success: true,
        };
      } 
      leads.update({ status:leadStatus.ACKNOWLEDGE });
     }
    responseData = {
      status: 200,
      message: "status update successfully",
      success: true,
    };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const LeadServices = {
  count,
  getLeads,
  updateStatus,
};

export default LeadServices;
