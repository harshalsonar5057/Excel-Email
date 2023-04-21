import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain };
import Models from "../models";
import appConfig from "../common/appConfig";
import { commonStatuses } from "../common/appConstants";
import dbHelper from "../common/dbHelper";
import Helper from "../common/helper";
import moment from "moment/moment";
import msgConst from "../common/msgConstants";
import { ASSET_IMAGES_DIR } from "../common/appConstants";
import bcrypt from "bcrypt";

// Create Vender
const createVender = async (data) => {
  let responseData = statusConst.error;
  try {
    const userPayload = {
      venderName: data.venderName || "",
      created_at: new Date(),
      updated_at: new Date(),
    };
    const user = await Models.venders.create(userPayload, { raw: true });
    const userId = user.id;

    if (!user) {
      throw new Error("Unable to create new vender");
    }

    responseData = {
      status: 200,
      message: "vender created successfully.",
      userId,
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

const getvender = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});

  try {
    const { offset, limit, pagination } = Helper.dataPagination(entityParams);

    const venderDeatail = await Models.venders.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });

    if (venderDeatail.rows.length > 0) {
      pagination["totalPages"] = Math.ceil(
        (venderDeatail || venderDeatail).count / pagination.pageSize
      );
      pagination["pageRecords"] = ((venderDeatail || {}).rows || []).length || 0;

      responseData = {
        status: 200,
        message: "venders data fetch successfully",
        pagination,
        data: venderDeatail,
        success: true,
      };
    } else {
      responseData = {
        status: 400,
        message: "venders not exist",
        success: false,
      };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const UserServices = {
  createVender,
  getvender,
};

export default UserServices;
