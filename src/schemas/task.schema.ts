
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import { Subtask,  } from './subtask.schema';
import { Lookup } from 'src/types/database';

@Schema({collection: 'tasks'})
export class Task extends Document{


  @Prop({required: true})
  name: string;

  @Prop({required: true})
  description: string;

  @Prop({required: true})
  dueAt: Date;

  @Prop({required: false})
  doneAt: Date;

  @Prop({ required: true, min: 0, max: 4 })
  priority: number;

  @Prop({required: true})
  createdAt: Date;

  @Prop({required: true})
  updatedAt: Date;

  @Prop({type: [Types.ObjectId], ref: Subtask.name})
  subtasks: Types.Array<Subtask>;

  static getSubtasks(): Lookup {
    return {
      from: 'subtasks',
      localField: '_id',
      foreignField: 'taskId',
      as: 'subtasks'
    }
  }
}


export const TaskSchema = SchemaFactory.createForClass(Task);