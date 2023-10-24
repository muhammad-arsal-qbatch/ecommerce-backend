import express from 'express';

import ScriptMethods from '../script-methods';
import passport from 'passport';
import DashboardStats from '../models/dashboard-stats';

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
        res.send(error.message);
    }
});

nonAuthenticatedRouter.get('/getStats',passport.authenticate('jwt', { session:false }), async (req, res) => {
    try {
        const stats = await DashboardStats.find({});

        res.send(stats);
    } catch (error) {
        res.send(error);
    }
});

export default nonAuthenticatedRouter;