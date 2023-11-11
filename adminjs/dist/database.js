import mongoose from 'mongoose';
export const connect = (uri, dbSetting) => {
    return mongoose.connect(uri, dbSetting);
};
export const DatabaseURI = "mongodb://fagbot:fagbot@localhost:27018/fagbot";
