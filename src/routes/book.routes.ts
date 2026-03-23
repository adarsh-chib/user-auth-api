import Express from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { createBook, getAllBooks} from "../controller/book.controller";

const bookRouter = Express.Router();

bookRouter.post(
  "/books",
  authenticationMiddleware,
  authorizationMiddleware("admin","manager"),
  upload.single("pdf"),
  createBook,
);

bookRouter.get(
    "/books",
    authenticationMiddleware,
    authorizationMiddleware("admin","manager"),
    getAllBooks
)

export default bookRouter;
