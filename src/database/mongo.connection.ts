import {Condition, Filter, MongoClient, ObjectId} from "mongodb";
import { mongoConfig } from "src/config";
import { Lookup } from "src/types/database";

export class MongoConnection {

    private static instance: MongoConnection;
    private client: MongoClient;

    private constructor() {
        this.client = new MongoClient(mongoConfig.uri);
    }

    static getInstance(): MongoConnection {
        if (!this.instance) {
            this.instance = new MongoConnection();
        }
        return this.instance;
    }

    async connect() {
        await this.client.connect();
    }

    async close() {
        await this.client.close();
    }

    async insertData<T>(collectionName: string, data: T) {
        const collection = this.client.db().collection(collectionName);
        return await collection.insertOne(data);
    }

    async findData<T>(collectionName: string, query: Filter<T>={}, relations?: Lookup[]): Promise<T[]> {
        const collection = this.client.db().collection(collectionName);
        const {skip=0, limit=100} = query;
        if(relations && relations.length > 0){
            return await collection.aggregate([
                {$match: query},
               ...relations.map(relation => {
                   return {$lookup: {
                       from: relation.from,
                       localField: relation.localField||'_id',
                       foreignField: relation.foreignField,
                       as: relation.as,
                       pipeline: [
                           {$limit: 100}
                       ]
                       
                   }}
               })
            ]).skip(skip).limit(limit).toArray() as T[];
        }
        return await collection.find(query).toArray() as T[];
    }

    async findById<T>(collectionName: string, id: Condition<ObjectId>, relations?: Lookup[]): Promise<T|null> {
        const collection = this.client.db().collection(collectionName);
        let result: T|null = null;
        if(relations && relations.length > 0){
             const results = await collection.aggregate([
                {$match: {_id: id}},
                relations.map(relation => {
                    return {$lookup: {
                        from: relation.from,
                        localField: relation.localField||'_id',
                        foreignField: relation.foreignField,
                        as: relation.as
                    }}
                })
            ]).toArray() as T[];
            if(results.length > 0){
               result = results[0];
            }
        } else {
            result = (await collection.findOne({_id: id}) as T) || null;
        }
        return result;
    }

    async updateData<T>(collectionName: string, query: Filter<T>, data: T) {
        const collection = this.client.db().collection(collectionName);
        return await collection.updateOne(query, data);
    }

    async deleteData<T>(collectionName: string, query: Filter<T>) {
        const collection = this.client.db().collection(collectionName);
        return await collection.deleteOne(query);
    }


}