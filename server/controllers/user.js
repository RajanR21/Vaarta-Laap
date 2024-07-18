import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

export const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;

  const avatar = {
    public_id: "sfd",
    url: "sdasda",
  };

  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "User created");
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  console.log("haa", req.body);
  //   const user = await User.findOne({ username: "law" }).select("+password");
  //   if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

  //   const isMatch = await compare(password, user.password);

  //   if (!isMatch)
  //     return next(new ErrorHandler("Invalid Username or Password", 404));

  //   sendToken(res, user, 200, `Welcome Back, ${user.name}`);
};
