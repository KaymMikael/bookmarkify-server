import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routers/user/router.js";

const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//routers
app.use("/v1/api", UserRouter);

app.get("/v1/api", (req, res) => {
  res.send({ message: "API is working fine." });
});

app.listen(process.env.PORT, () => console.log("Server started"));
