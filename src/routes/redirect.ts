import { Router } from 'express';
import Slug from '../lib/Slug';
import isbot from 'isbot';
let router = Router();

router.get('/:id', async (req, res) => {
    let data = await global.slugs.getModel().findOne({ slug: req.params.id });

    if(!data)
        return res.status(200).render('404-slug', { slug: req.params.id });

    let slug = new Slug(data);
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.redirect(slug.getDestination());
    
    if(!isbot(req.get('user-agent')))
        await slug.incrementClicks();
});

exports.router = router;
exports.path = '/';