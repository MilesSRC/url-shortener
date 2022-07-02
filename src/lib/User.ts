import crypto from 'crypto';
import mongoose from 'mongoose';
import Slug from './Slug';

export default class User extends mongoose.Document {
    private name: string;
    private email: string;
    private password: string;
    private createdAt: Date;
    private slugs: string[];

    private model: mongoose.Model<any> = global.users;

    constructor(details: UserData) {
        super(details);
        this.name = details.name;
        this.email = details.email;
        this.password = details.password;
        this.createdAt = details.createdAt;
        this.slugs = details.slugs;
    }

    /* Getters */
    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public isPassword(password: string): boolean {
        return crypto.createHash('sha512').update(password).digest('hex') === this.password;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getSlugs(): string[] {
        return this.slugs;
    }

    public async getRenderedSlugs(): Promise<Slug[]> {
        return await global.slugs.getModel().find({ owner: this.email }).map((slug: SlugData) => new Slug(slug));
    }

    /* Setters */
    public async setPassword(password: string): Promise<void> {
        this.password = crypto.createHash('sha256').update(password).digest('hex');

        await this.model.updateOne({ email: this.email }, { password: this.password });
    }

    public async addSlug(slug: string | Slug): Promise<void> {
        if(typeof slug === 'string')
            this.slugs.push(slug);
        else
            this.slugs.push(slug.getID());

        await this.model.updateOne({ email: this.email }, { slugs: this.slugs });
    }
}