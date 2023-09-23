import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.route.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json())
app.use('/', analyzeRouter);


app.listen(port, () => {
    return console.log(`Server listening on: http://localhost:${port}/`);
});