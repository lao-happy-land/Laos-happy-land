import { defaultConfig } from 'swagger-typescript-api-es';

export default defaultConfig({
  name: 'api-axios.ts',
  output: './src/apis/axios-gentype',
  url: process.env.API_URL!,
  httpClientType: 'axios',
});