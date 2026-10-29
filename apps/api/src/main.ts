import { createApplication } from "./application.js";

const app = await createApplication();
await app.listen(Number(process.env.PORT || 4000), "127.0.0.1");
