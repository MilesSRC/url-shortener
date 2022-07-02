import { Router } from 'express';
let router = Router();

router.get('/', (req, res) => {
    res.send({
        message: 'Heya from milesr.dev 👋',
        version: require('../../package.json').version
    });
});

exports.router = router;
exports.path = '/api';