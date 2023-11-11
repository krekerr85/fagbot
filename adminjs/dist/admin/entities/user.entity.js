import mongoose from 'mongoose';
export var Role;
(function (Role) {
    Role["user"] = "user";
    Role["pidor"] = "pidor";
    Role["cool"] = "cool";
})(Role || (Role = {}));
const userSchema = new mongoose.Schema({
    username: { type: String },
    user_id: { type: Number },
    first_name: { type: String },
    last_name: { type: String },
    role: { type: String, enum: Role },
    date_created: { type: Date },
});
const UserModel = mongoose.model('User', userSchema);
export default UserModel;
