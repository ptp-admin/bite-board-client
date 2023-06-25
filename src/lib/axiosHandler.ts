import axios from 'axios';
import * as https from 'https';

export const axiosHandler = async ({ route, ...queryOpts }: { route: string, [key: string]: any }) => {
  const SERVER_PORT = 3456

  const query = {
    ...queryOpts,
    baseURL: `http://localhost:${SERVER_PORT}`,
    url: route,
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
  };
  
  return await axios(query);
};