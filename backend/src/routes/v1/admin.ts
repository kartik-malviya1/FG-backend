import { Request, Response, Router } from 'express';

const adminRouter = Router();

adminRouter.get('/books', async (req: Request, res: Response) => {
    try {
        const books: { title: string; author: string }[] = [];
        res.status(200).json({ message: 'Books fetched successfully', data: books });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching books', error: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

export default adminRouter;
