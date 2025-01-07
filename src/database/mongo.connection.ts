import { Condition, Filter, MongoClient, ObjectId } from "mongodb";
import { mongoConfig } from "src/config";
import { DBResult, Lookup } from "src/types/database";
import { QueryParams } from "src/types/query.params";
import QueryTool from "src/utils/query.tool";
import createCollectionIndexes from "./collection.indexes";

export class MongoConnection {

    private static instance: MongoConnection;
    private client: MongoClient;

    private constructor() {
        this.client = new MongoClient(mongoConfig.uri);
    }

    static getInstance(): MongoConnection {
        if (!this.instance) {
            this.instance = new MongoConnection();
            createCollectionIndexes(this.instance.client.db());
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

    async findData<T>(collectionName: string, query: QueryParams = {}, relations?: Lookup[]): Promise<DBResult<T>> {
        const collection = this.client.db().collection(collectionName);
        const { page = 1, pageSize = 1000 } = query;
        const skip = Number(page);
        const limit = Number(pageSize);
        let dbQuery = null;
        const filters = QueryTool.getFilter(query);
        const search = QueryTool.getSearch(query);
        const sort = QueryTool.getSort(query);


        if (relations && relations.length > 0) {
            dbQuery = collection.aggregate([
                { $match: filters },
                { $match: search },
                ...relations.map(relation => {
                    return {
                        $lookup: {
                            from: relation.from,
                            localField: relation.localField || '_id',
                            foreignField: relation.foreignField,
                            as: relation.as,
                            pipeline: [
                                { $limit: 100 }
                            ]

                        }
                    }
                }),

            ]);
        } else {
            dbQuery = collection.find({
                ...filters,
                ...search
            });
        }
        const totalRows = await collection.countDocuments({ ...filters, ...search });

        const rows = await dbQuery.skip((skip - 1) * limit).limit(Number(limit)).sort(sort).toArray() as T[];
        console.log(await dbQuery.explain());
        const nextPage = totalRows > (skip + 1) * limit ? skip + 1 : null;
        const prevPage = skip > 1 ? skip - 1 : null;
        const lastPage = Math.ceil(totalRows / limit);
        return {
            currentPage: skip,
            lastPage: lastPage,
            nextPage: nextPage,
            prevPage: prevPage > lastPage ? lastPage : prevPage,
            count: totalRows,
            pageSize: limit,
            inThisPage: rows.length,
            rows: rows
        }

    }

    async findById<T>(collectionName: string, id: Condition<ObjectId>, relations?: Lookup[]): Promise<T | null> {
        const collection = this.client.db().collection(collectionName);
        let result: T | null = null;
        if (relations && relations.length > 0) {
            const results = await collection.aggregate([
                { $match: { _id: id } },
                relations.map(relation => {
                    return {
                        $lookup: {
                            from: relation.from,
                            localField: relation.localField || '_id',
                            foreignField: relation.foreignField,
                            as: relation.as
                        }
                    }
                })
            ]).toArray() as T[];
            if (results.length > 0) {
                result = results[0];
            }
        } else {
            result = (await collection.findOne({ _id: id }) as T) || null;
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