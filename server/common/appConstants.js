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

export default {
  pageSize: 15,
  pageSizeLimit: 200,
  timeZone: 'Asia/Kolkata',
  thumbMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'],
  excelFileMimeTypes: ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  // videoMimeTypes: ['video/MP4', 'video/MKV', 'video/gif', 'video/bmp'],
  fontMimeTypes: ['ttf', 'otf'],
  standardDateFormat: "YYYY-MM-DD HH:mm:ss",
}