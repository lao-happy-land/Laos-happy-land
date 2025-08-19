import { defaultConfig } from "swagger-typescript-api-es";

export default defaultConfig({
  name: "gentype-axios.ts",
  output: "./src/@types",
  url:
    process.env.API_URL ?? "https://laos-happy-land.onrender.com/api/docs-json",
  httpClientType: "axios",
});
