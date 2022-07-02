import mongoose from "mongoose";
import { userSchema } from "./Schemas";
import User from "./User";

export default class UsersManager {
    private cache: Map<string, Data> = new Map();
    private model: mongoose.Model<any> = mongoose.model("User", userSchema);

    constructor(){
        global.users = this;
    }

    public async getUser(email: string): Promise<User | undefined> {
        if(this.cache.has(email)) 
            return this.cache.get(email)?.cache;
        
        const user = await this.model.findOne({ email });
        return new User(user);
    }

    /* Getters */
    public getModel(): mongoose.Model<any> {
        return this.model;
    }
}