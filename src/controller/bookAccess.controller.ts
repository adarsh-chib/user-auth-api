import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api.error";
import { ApiResponse } from "../utils/api.response";
import {
  BookToUserServices,
  getAssignBookByIdService,
  getBooksServices,
} from "../services/bookAccess.service";

export const assignBookToUser = async (
  req: Request<{ bookId: string; userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { bookId, userId } = req.params;

  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  try {
    const access = await BookToUserServices(bookId, req.user.id, userId);

    return res
      .status(201)
      .json(new ApiResponse(201, "book assigned successfully", access));
  } catch (err) {
    next(err);
  }
};

export const getbooks = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const {id} = req.params;

  try {
    const booksAccess = await getBooksServices(id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, "all books are fetched successful", booksAccess),
      );
  } catch (err) {
    next(err);
  }
};

export const getAssignBookById = async(
  req : Request<{id : string}>,
  res : Response,
  next : NextFunction,
)=>{
   const {id} = req.params
   console.log(id);

   try{
    const bookAssigned = await getAssignBookByIdService(id);

    return res
    .status(200)
    .json(
      new ApiResponse(200, "Book assignment fetched successfully",bookAssigned)
    )
   }
   catch(err){
    next(err);
   }
}