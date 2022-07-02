// Initalize database connection with MongoDB
import mongoose, { Schema } from "mongoose";
import joi from "joi";

/* Slug Schema */
const slugSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    destination: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    stats: {
        type: Object,
        default: {
            clicks: 0
        }
    },
    lastClicked: {
        type: Date,
        default: Date.now
    }
});

/* User Schema */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slugs: {
        type: [{type: Schema.Types.ObjectId, ref: "Slug"}],
        required: true,
        default: []
    }
});

const slugCreateSchema = joi.object({
    destination: joi.string().uri().regex(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/).required(),
})

/* Export */
export { slugSchema, userSchema, slugCreateSchema };