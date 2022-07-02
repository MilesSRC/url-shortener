import { Router } from 'express';
let router = Router();

router.get('/', async (req, res) => {
    res.send({
        count: await global.users.getModel().estimatedDocumentCount({}),
    });
});

router.get('/:id', (req, res) => {

});

exports.router = router;
exports.path = '/api/users';