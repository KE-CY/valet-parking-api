import logger from "./logger";

export const checkAllSettled = (ret: PromiseSettledResult<any>[]) => {
  const hasError = ret.some((r) => r.status === 'rejected');
  if (hasError) {
    logger.info('pre check reservationData has error, need reRun', ret);
  }
  return hasError;
}