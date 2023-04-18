import path from "path";

export const DS = "/";
export const ROOT_DIR = path.resolve('./');
export const ASSETS_DIR = `${ROOT_DIR}${DS}assets`;
export const ASSET_FILE_DIR = `${ROOT_DIR}${DS}assets${DS}`
export const FILE_DIR = `${ROOT_DIR}${DS}assets${DS}files${DS}`
export const ASSET_IMAGES_DIR = `${ASSETS_DIR}${DS}images${DS}`;


export const commonStatuses = {
  ACTIVE: {
    id: 1,
    title: "active"
  },
  INACTIVE: {
    id: 0,
    title: "inactive"
  },
  DELETED: {
    id: 2,
    title: "deleted"
  },
  default: {
    value: 1
  }
}
