export const ErrorCodes = {
  SERVER_ERROR: {
    code: 'ERR_SERVER_ERROR',
    message: 'Internal server error.',
  },
  PATH_PARAM_REQUEST_VALIDATION_FAILED: {
    code: 'ERR_PATH_PARAM_REQUEST_VALIDATION_FAILED',
    message: 'Failed to validate request path parameters.',
  },
  QUERY_REQUEST_VALIDATION_FAILED: {
    code: 'ERR_QUERY_REQUEST_VALIDATION_FAILED',
    message: 'Failed to validate request query.',
  },
  BODY_REQUEST_VALIDATION_FAILED: {
    code: 'ERR_BODY_REQUEST_VALIDATION_FAILED',
    message: 'Failed to validate request body.',
  },
  USER_NAME_ALREADY_EXISTS: {
    code: 'ERROR_USER_NAME_ALREADY_EXISTS',
    message: 'Username already exists. Please choose a different one.'
  },
  LOGIN_ERROR: {
    code: 'ERROR_LOGIN',
    message: 'Oops! Your login details are incorrect. Please try again.'
  },
  SYSTEM_COUNTRY_NOT_FOUND: {
    code: 'ERROR_SYSTEM_COUNTRY_NOT_EXISTS',
    message: 'We couldn’t find the selected country. Please check and try again.',
  },
  USER_NOT_FOUND: {
    code: 'ERROR_USER_NOT_EXISTS',
    message: 'We couldn’t find an account with that information.'
  },
  VALET_PARKING_RECORD_NOT_FOUND: {
    code: 'ERROR_VALET_RECORD_NOT_FOUND',
    message: 'We couldn’t find any valet parking records for this request.'
  }

}