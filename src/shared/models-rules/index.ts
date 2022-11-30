import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  const encodedDataPart = request.headers.authorization.split('.')[1];
  const dataString = Buffer.from(encodedDataPart, 'base64').toString('utf8');
  const data = JSON.parse(dataString);
  console.log('retrieved data', data);
  return data.sub;
}
