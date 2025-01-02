
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import { Subtask,  } from './subtask.schema';

@Schema()
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
}


export const TaskSchema = SchemaFactory.createForClass(Task);