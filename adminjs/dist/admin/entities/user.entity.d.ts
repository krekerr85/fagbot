import mongoose from 'mongoose';
export declare enum Role {
    user = "user",
    pidor = "pidor",
    cool = "cool"
}
export interface UserDocument extends mongoose.Document {
    username: string;
    user_id: number;
    first_name: string;
    last_name: string;
    role: Role;
    date_created: Date;
}
declare const UserModel: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument> & UserDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default UserModel;
