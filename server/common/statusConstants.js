export default {
  // Common constants
  authSuccess: { status: 200, message: 'Login successful' },
  success: { status: 200, message: 'Success' },
  fetchSucccess: { status: 200, message: "user fetch successfully" },
  unauthorized: { status: 401, message: 'Invalid Username or Password' },
  invalidEmail: { status: 401, message: 'Invalid Email or Password' },
  authError: { status: 401, message: 'Invalid Username or Password' },
  noTokenProvided: { status: 401, message: 'No token provided' },
  tokenExpired: { status: 401, message: 'Token expired' },
  invalidToken: { status: 401, message: 'Invalid token' },
  invalidUserToken: { status: 401, message: 'User with this token does not exist' },
  invalidAdminToken: { status: 401, message: 'Admin with this token does not exist' },
  adminNotFound:{ status: 401, message: 'Invalid admin id' },
  forbidden: { status: 403, message: 'Forbidden' },
  restLink:{status:404, message:"reset password link error" },
  deleteResourceError: { status: 422, message: 'Something went wrong while deleting data' },
  fetchResourceError: { status: 422, message: 'Something went wrong while fetching data' },
  validationErrors: { status: 422, message: 'Unable to process form request' },
  somethingWentWrong: { status: 422, message: 'Something went wrong !!!' },
  notFound: { status: 404, message: 'Requested data not found' },
  error: { status: 200, message: 'Error' },
}

/* export default {
  error: { status: 200, message: 'Error' }
} */