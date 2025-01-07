import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import SubtaskDto from 'src/dtos/subtask.dto';
import { Subtask } from 'src/schemas/subtask.schema';
import { ObjectId } from 'mongodb';
import { MongoConnection } from 'src/database/mongo.connection';
import { Task } from 'src/schemas/task.schema';
import { QueryParams } from 'src/types/query.params';

@Injectable()
export class SubtaskService {
    protected readonly db: MongoConnection;
    constructor(
        @InjectModel(Subtask.name) protected readonly subtaskModel: Model<Subtask>
    ) {
        this.db = MongoConnection.getInstance();
    }

    async createSubtask(taskId: string, subtask: SubtaskDto) {
        const subTasks = [];
        const tasks: Array<string> = (await this.db.findData<Task>('tasks')).rows.map(task => task._id as string);
        for (let i = 0; i < 15000; i++) {
            const newSubtask = {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: `Subtask ${i + 1}`,
                description: `Subtask ${i + 1} description`,
                taskId: new ObjectId(tasks[Math.floor(Math.random() * tasks.length)])
            }
            const newTask = await this.db.insertData<Subtask>('subtasks', newSubtask as unknown as Subtask);
            subTasks.push(newTask);
        }
        return subTasks;
    }


    async getAllSubtasks(query: QueryParams) {
        return await this.db.findData<Subtask>("subtasks", query);
    }

    async getSubtaskById(id: string) {
        try {
            return await this.subtaskModel.findById(id);
        } catch (error) {
            return null;
        }
    }

    async updateSubtask(id: string, subtask: SubtaskDto) {
        return await this.subtaskModel.findByIdAndUpdate(id, subtask);
    }

    async deleteSubtask(id: string) {
        return await this.subtaskModel.findByIdAndDelete(id);
    }
}
