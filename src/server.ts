import koa from "koa";
import Router from "koa-router";
import cors from "@koa/cors";
import { Server } from "socket.io";

const PORT = 4000;
const app = new koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "Server is Running";
});

app.use(cors({ credentials: true }));
app.use(router.routes()).use(router.allowedMethods());
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id}가 연결되었습니다.`);

  socket.on("chat message", (msg) => {
    console.log(`${msg.name}가 ${msg.message}를 보냈습니다.`);

    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id}가 접속을 종료했습니다.`);
  });
});
