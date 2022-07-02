import mongoose from "mongoose";
import User from "./User";

interface SlugCreateData {
    slug: string;
    destination: string;
    owner?: string;
    createdAt?: Date;
    stats?: {
        clicks: number;
    }
}

export default class Slug {
    private slug: string;
    private destination: string;
    private owner: string | undefined;
    private createdAt: Date;
    private stats: {
        clicks: number;
    };
    private model: mongoose.Model<any> = global.slugs.getModel();
    public class: mongoose.Document;

    constructor(data: SlugData | SlugCreateData) {
        this.slug = data.slug;
        this.destination = data.destination;
        this.owner = data.owner || undefined;
        this.createdAt = data.createdAt || new Date();
        this.stats = data.stats || {
            clicks: 0
        };

        this.class = new this.model(this);
    }

    /* Getters */
    public getID(): string {
        return this.slug;
    }

    public getDestination(): string {
        return this.destination;
    }

    public hasOwner(): boolean {
        return this.owner !== undefined;
    }

    public getOwner(): string | undefined {
        return this.owner;
    }

    public async getRenderedOwner(): Promise<User> {
        return await this.class.populate('owner');
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getStats(): {
        clicks: number;
    } {
        return this.stats;
    }

    /* Setters */
    public async setDestination(destination: string): Promise<void> {
        this.destination = destination;

        await this.model.updateOne({ slug: this.slug }, { destination: this.destination });
    }

    public async setOwner(owner: string): Promise<void> {
        this.owner = owner;
    }

    public async incrementClicks(): Promise<void> {
        this.stats.clicks++;

        await this.model.updateOne({ slug: this.slug }, { stats: this.stats });
    }

    /* API */
    public toSafeObject(): SlugCreateData {
        return {
            slug: this.slug,
            destination: this.destination,
            owner: this.owner,
            createdAt: this.createdAt,
            stats: this.stats,
        };
    }

    public async toSafeRenderedObject(): Promise<{
        slug: string;
        destination: string;
        owner: string;
        created: Date;
        stats: { clicks: number };
    }> {
        return {
            slug: this.slug,
            destination: this.getDestination(),
            owner: this.hasOwner() ? (await this.getRenderedOwner()).getName() : 'no owner',
            created: this.getCreatedAt(),
            stats: this.getStats(),
        }
    }
}
