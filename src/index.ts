import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/api/greeting', (req: Request, res: Response) => {
    res.json({
        message: 'Hello from the TypeScript App!',
        served_at: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`TypeScript app listening on port ${port}`);
});