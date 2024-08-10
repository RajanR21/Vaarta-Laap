import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./utils/features.js";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/events.js";
import { errorMiddleware } from "./middlewares/error.js";
import { corsOptions } from "./constants/config.js";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { socketAuthenticator } from "./middlewares/auth.js";
import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import { Message } from "./models/message.js";
import { getSockets } from "./lib/helper.js";
dotenv.config({
  path: "./.env",
});

const userSocketIDs = new Map();
const onlineUsers = new Set();

connectDB(process.env.MONGO_URI);
const PORT = process.env.port || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = createServer(app);

export const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";

const io = new Server(server, {
  cors: corsOptions,
});

app.set("io", io);

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(multer().array());
// app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors(corsOptions));

app.use("/user", userRoute);
app.use("/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("Hello from Home");
});

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (error) => await socketAuthenticator(error, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),

      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);

    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      throw new Error(error);
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});

export { userSocketIDs };
