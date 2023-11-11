import { Mongoose } from 'mongoose';
export declare const connect: (uri: string, dbSetting: {
    [key: string]: any;
}) => Promise<Mongoose>;
export declare const DatabaseURI = "mongodb://fagbot:fagbot@localhost:27018/fagbot";
