import { Book } from "../models/bookmanagement.model"



type CreateBookInput = {
  title: string;
  author: string;
  description?: string;
  pdfUrl: string;
  addedBy: string;
  isbn : string;
  price : number;
  quantity : number;
  category : string;
  publishedYear: number;
};


export const  createBookService = async (bookData : CreateBookInput)=>{
     const book = await Book.create(bookData);
     return book
}

export const getAllBooksService = async ()=>{
    const allBooks = await Book.find().populate("addedBy", "name email role");
    return  allBooks;
}


