import Express from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { createBook, getAllBooks } from "../controller/book.controller";
import { assignBookToUser, getAssignBookById, getbooks, revokeBookTouser } from "../controller/bookAccess.controller";

const bookRouter = Express.Router();

bookRouter.post(
  "/books",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  upload.single("pdf"),
  createBook,
);

bookRouter.get(
  "/books",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  getAllBooks,
);

bookRouter.post(
  "/books/:bookId/assign/:userId",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  assignBookToUser,
);

bookRouter.post(
  "/books/:bookId/revoke/:userId",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  revokeBookTouser,
);

bookRouter.get(
  "/books/assign/:id",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  getbooks,    // here we can check the assigned books by manager as well as to user
);

bookRouter.get(
  "/book/assign/:id",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  getAssignBookById
)



export default bookRouter;
