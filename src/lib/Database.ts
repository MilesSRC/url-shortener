import mongoose from "mongoose";

export default class Database {
    constructor() {
        this.connect();
    }

    private connect() {
        mongoose.connect(process.env.DB_URI || "mongodb://localhost:27017/");
    }
}