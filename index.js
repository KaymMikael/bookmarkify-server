import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRouter from "./routers/auth/router.js";
import { CORS_CONFIG } from "./config.js";
import BookMarkRouter from "./routers/bookmark/router.js";

const app = express();

//middlewares
app.use(express.json());
app.use(cors(CORS_CONFIG));
app.use(cookieParser());

//routers
app.use("/v1/api/auth", AuthRouter);
app.use("/v1/api/bookmarks", BookMarkRouter);

app.get("/v1/api", (req, res) => {
  res.send({ message: "API is working fine." });
});

app.listen(process.env.PORT, () => console.log("Server started"));
