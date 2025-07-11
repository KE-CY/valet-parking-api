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
  }
}