import { stat } from "node:fs";
import {
  createUserService,
  userSigninServices,
  userUpdataService,
} from "../services/users.service";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await createUserService(name, email, password, role);
    res.status(200).json({
      status: 200,
      message: "New user has been created",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 400,
      message: err.message,
    });
  }
};

export const userSignin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({
      status: 400,
      message: "invalid user and password",
    });
  }

  

  try {
    const user = await userSigninServices(email, password);

    if (!user) {
      res.status(400).json({
        status: 400,
        message: "User Credinatials worng ",
      });
    }
    res.status(200).json({
      status: 200,
      message: "login successfull",
      data: user,
    });
  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: err.message
    });
  }
};


export const userUpdata = async (
  req: Request<{ email: string }, unknown, { role: string }>,
  res: Response
) => {
  const userEmail = req.params.email;
  const userData = req.body;

  try {
    const userUpdate = await userUpdataService(userEmail, userData);

    return res.status(200).json({
      status: 200,
      message: "user updated successfully",
      data: userUpdate,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";

    return res.status(400).json({
      status: 400,
      message,
    });
  }
};
