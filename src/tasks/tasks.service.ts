import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoConnection } from 'src/database/mongo.connection';
import TaskDto from 'src/dtos/task.dto';
import { Subtask } from 'src/schemas/subtask.schema';
import { Task } from 'src/schemas/task.schema';

@Injectable()
export class TasksService {
    protected readonly db: MongoConnection
    constructor(
        @InjectModel(Task.name) protected readonly taskModel: Model<Task>
    ) {
        this.db = MongoConnection.getInstance();
    }


    async createTask(task: TaskDto) {
        const newTask = {
            createdAt: new Date(),
            updatedAt: new Date(),
            ...task
        }
        return new this.taskModel(newTask).save();
    }

    async getAllTasks(includeSubtasks: boolean = false) {
        if (includeSubtasks) {
            return this.db.findData<Task>('tasks', {}, [
                Task.getSubtasks()
            ]);
        }
        return await this.db.findData<Task>('tasks');
    }

    async getTaskById(id: string) {
        try {
            return await this.taskModel.findById(id);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async updateTask(id: string, task: TaskDto) {
        return await this.taskModel.findByIdAndUpdate(id, task);
    }

    async deleteTask(id: string) {
        return await this.taskModel.findByIdAndDelete(id);
    }
}
