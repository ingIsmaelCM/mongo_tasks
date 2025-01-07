import { Db } from "mongodb";
import { Lookup } from "src/types/database";



export default abstract class Schema<T>{


    abstract getRelations(): Record<string, Lookup>;

    abstract getIndexablesToSearch(): string[];

    abstract getIndexablesToFilter(): string[];

    protected db: Db; 
    protected collectionName: string;

    constructor(db: Db, collectionName: string) {
      this.collectionName = collectionName;
      this.db = db;
    }

    async createIndexes(){
        const collection = this.db.collection(this.collectionName);
        const indexes = this.getIndexablesToSearch().reduce((acc, cur) => {
            return {...acc, [cur]: 'text'};
        }, {});
        await collection.createIndex({...indexes});
        await collection.createIndex({_id: 'text'});
    }


}