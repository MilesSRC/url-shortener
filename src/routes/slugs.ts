import { Router } from 'express';
import { nanoid } from 'nanoid';
import { slugCreateSchema } from '../lib/Schemas';
import Slug from '../lib/Slug';
import jsonwebtoken from 'jsonwebtoken';
import erl from 'express-rate-limit';
import fs from 'fs';

let router = Router();

router.get('/', erl({ windowMs: 60000 * 60, max: 50 }), async (req, res) => {
    res.send({
        count: await global.slugs.getModel().estimatedDocumentCount({}),
    });
});

router.get('/:id', erl({ windowMs: 60000 * 60, max: 20 }), async (req, res) => {
    let data = await global.slugs.getModel().findOne({ slug: req.params.id });
    if(!data) return res.status(404).render('404-slug')
    
    let slug = new Slug(data);
    res.send(await slug.toSafeRenderedObject());
});

router.post("/", erl({ windowMs: 60000 * 60, max: 6, message: { message: "Too many links" }, skipFailedRequests: true }), async (req, res) => {
    slugCreateSchema.validateAsync(req.body).then(async () => {
        let slug = new Slug({
            slug: nanoid(10),
            destination: req.body.destination,
        });

        if(req.headers["x-auth-token"] && typeof req.headers["x-auth-token"] == "string") {
            jsonwebtoken.verify(req.headers["x-auth-token"], fs.readFileSync(__dirname + "../../private.key"), async (err, decoded) => {
                if(err || !decoded) return res.status(403).render('403-auth', {
                    token: req.headers["x-auth-token"],
                });

                if(typeof decoded == "string") return res.status(403).render('403-auth', {
                    token: req.headers["x-auth-token"],
                });

                if(!decoded.id) return res.status(403).render('403-auth', {
                    token: req.headers["x-auth-token"],
                });

                await slug.setOwner(decoded.id);
                await slug.class.save();
                res.send(slug.toSafeObject());
            });
        } else {
            await slug.class.save();
            res.send(slug.toSafeObject());
        }
    }).catch(err => {
        console.log(err);
        
        res.status(400).send(err);
    });
});

exports.router = router;
exports.path = '/api/slugs';