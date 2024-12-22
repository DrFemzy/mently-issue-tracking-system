import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./services/user/route";
import projectRouter from "./services/project/route";
import issueRouter from "./services/issue/route";
import commentRouter from "./services/comment/route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("tiny"));

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/issue", issueRouter);
app.use("/api/comment", commentRouter);

app.get("/", (req, res) => {
  res.send("<marquee>Welcome to Mently Issue Tracking System!</marquee>");
});

export default app;
