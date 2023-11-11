import mongoose, { Mongoose } from 'mongoose';

export const connect = (
  uri: string,
  dbSetting: { [key: string]: any },
): Promise<Mongoose> => {
  return mongoose.connect(uri, dbSetting);
};

export const DatabaseURI = "mongodb://fagbot:fagbot@localhost:27018/fagbot";
