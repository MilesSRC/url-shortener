import mongoose from "mongoose";
import { slugSchema } from "./Schemas";
import Slug from "./Slug";

export default class SlugsManager {
    private cache: Map<string, Data> = new Map();
    private model: mongoose.Model<any> = mongoose.model("Slug", slugSchema);

    constructor(){
        global.slugs = this;
    }

    public async getSlug(slug: string): Promise<Slug | undefined> {
        if(this.cache.has(slug)) 
            return this.cache.get(slug)?.cache;
        
        const user = await this.model.findOne({ slug });
        return new Slug(user);
    }

    /* Getters */
    public getModel(): mongoose.Model<any> {
        return this.model;
    }
}