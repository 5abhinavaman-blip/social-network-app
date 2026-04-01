import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
}, {
    timestamps: true,
});

export default mongoose.model<IPost>('Post', PostSchema);