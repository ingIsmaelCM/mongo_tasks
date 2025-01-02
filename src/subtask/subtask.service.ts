import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import SubtaskDto from 'src/dtos/subtask.dto';
import { Subtask } from 'src/schemas/subtask.schema';

@Injectable()
export class SubtaskService {
    constructor (
        @InjectModel(Subtask.name) protected readonly subtaskModel: Model<Subtask>
    ){

    }

    async createSubtask(taskId: string, subtask: SubtaskDto){
        const newSubtask = {
            createdAt: new Date(),
            updatedAt: new Date(),
            ...subtask,
            taskId: taskId
        }
        return new this.subtaskModel(newSubtask).save();
    }


    async getAllSubtasks(taskId?: string){
       if(taskId){
           return await this.subtaskModel.find({taskId: taskId});
       }
       return await this.subtaskModel.find();
    }

    async getSubtaskById(id: string){
        try {
            return await this.subtaskModel.findById(id);
        } catch (error) {
            return null;
        }
    }

    async updateSubtask(id: string, subtask: SubtaskDto){
        return await this.subtaskModel.findByIdAndUpdate(id, subtask);
    }

    async deleteSubtask(id: string){
        return await this.subtaskModel.findByIdAndDelete(id);
    }
}
