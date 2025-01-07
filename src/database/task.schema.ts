import { Db } from "mongodb";
import TaskDto from "src/dtos/task.dto";
import { Lookup } from "src/types/database";
import Schema from "./schema";


export default class TaskSchema extends Schema<TaskDto> {
    constructor(db: Db) {
        super(db, "tasks");
    }

    getRelations(): Record<string, Lookup> {
        return {
            subtasks: {
                from: 'subtasks',
                localField: '_id',
                foreignField: 'taskId',
                as: 'subtasks'
            }
        }
    }
    getIndexablesToSearch(): string[] {
        return ['name', 'description'];
    }

    getIndexablesToFilter(): string[] {
        return ['name', 'description'];
    }

    
}