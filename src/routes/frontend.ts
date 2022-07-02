import express from 'express';
let router = express.Router();


router.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", process.env.FRONTEND_CSP || "script-src 'self'");
    next();
})
router.use(express.static(__dirname + '/../../public'));

exports.router = router;
exports.path = '/';