import express from 'express';

import ScriptMethods from '../script-methods';

const nonAuthenticatedRouter = express.Router();

nonAuthenticatedRouter.get('/script', async (req, res) => {
    try {
        const { query } = req;
        const {
            method,
            ...rest
        } = query;

        await ScriptMethods({
            method,
            ...rest
        });

        res.send('OK');
    } catch (error) {
        console.log(`Error: ${error}`);
        res.send(error.message);
    }
});

export default nonAuthenticatedRouter;