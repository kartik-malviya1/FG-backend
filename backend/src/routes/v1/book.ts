import { Router } from 'express';
import { addBook, deleteBook, getBooks, updateBook } from '../../controller/bookController';
import { requireAuth } from '../../middleware/auth';

export const bookRouter = Router();

bookRouter.post('/', requireAuth, addBook);
bookRouter.get('/', getBooks);
bookRouter.delete("/:id", requireAuth, deleteBook);
bookRouter.put("/:id", requireAuth, updateBook);

export default bookRouter;
