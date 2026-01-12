import { registerAs } from "@nestjs/config";

export default registerAs("appconfig", () => ({
    port: parseInt(process.env.PORT ?? '8000', 10),
    nodeEnv: process.env.NODE_ENV,
}));
  