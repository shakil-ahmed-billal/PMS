import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import DBconnect from "./config/DBconnect.js";

//route import 
import userRouter from "./routers/userRouter.js";
import projectRouter from "./routers/projectRouter.js";
import leaderRouter from "./routers/leaderRouter.js";
import taskRouter from "./routers/taskRouter.js"; 


const app = express();
dotenv.config();
DBconnect();
const port = process.env.PORT || 5000;


// middleware connection
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://excel-bd.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/leader", leaderRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/leader", leaderRouter);



// server start debug
app.get("/", (req, res) => res.send("server  is running"));
app.listen(port, () => console.log("server is running"));