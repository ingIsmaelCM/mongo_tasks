import { Db } from "mongodb";


export default async function createCollectionIndexes(db: Db){

    const collections = await db.collections();
    collections.forEach(async collection => {
        await collection.createIndex({"$**": "text"});
    });
}