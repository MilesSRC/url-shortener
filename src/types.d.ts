interface UserData {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    slugs: string[];
}

interface SlugData {
    slug: string;
    destination: string;
    owner: string | undefined;
    createdAt: Date;
    stats: {
        clicks: number;
    }
}

interface Data {
    cache: User,
    active: Date,
}