import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import {
  createBookService,
  getAllBooksService,
} from "../services/book.services";
import { ApiResponse } from "../utils/api.response";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title,
    author,
    description,
    isbn,
    price,
    quantity,
    category,
    publishedYear,
  } = req.body;

  if (!req.user) {
    return next(new ApiError(401, "user not found"));
  }

  if (!req.file) {
    return next(new ApiError(400, "pdf fle is required"));
  }

  try {
    const pdfUrl = `/${req.file.path.replace(/\\/g, "/")}`;

    const book = await createBookService({
      title,
      author,
      description,
      isbn,
      price: Number(price),
      quantity: Number(quantity),
      category,
      publishedYear: publishedYear ? Number(publishedYear) : undefined,
      pdfUrl,
      addedBy: req.user.id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, "new book has been uploaded", book));
  } catch (err) {
    next(err);
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allBooks = await getAllBooksService();
    return res
      .status(200)
      .json(new ApiResponse(200, "all books fetched successfully", allBooks));
  } catch (err) {
    next(err);
  }
};
