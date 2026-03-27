import Express from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { createBook, getAllBooks } from "../controller/book.controller";
import { assignBookToUser, getAssignBookById, getbooks, revokeBookTouser } from "../controller/bookAccess.controller";
import { bookUpload } from "../middleware/upload.middleware";

const bookRouter = Express.Router();

bookRouter.post(
  "/books",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  bookUpload.single('pdf'),
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
