import express from "express";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";
import bodyParser from "body-parser";
import cors from "cors";
import {
  authRouter,
  publicRouter,
  userRouter,
  pollRouter,
  friendsRouter,
} from "./routes/index.js";
import { auth } from "./middlewares/index.js";
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

const port = process.env.port || 4000;

app.use("/auth", authRouter);
app.use("/getlist", publicRouter);
app.use("/user", auth, userRouter);
app.use("/poll", auth, pollRouter);
app.use("/friends", auth, friendsRouter);

// app.get("/", async (req, res) => {
  

//   const poll = await prisma.poll.delete({
//     where: {
//       id: "3c12822b-30bd-4f3b-8ab2-b003e39c1ac5"
//     }
//   })
// console.log(poll)
//   const user = await prisma.user.delete({
//     where: {
//       id: "3c12822b-30bd-4f3b-8ab2-b003e39c1ac5"
//     }
//   })
//   console.log(user)

//   res.send("Unauthorized");
// });

app.listen(port, async () => {
  console.log(`Server running`);
});
