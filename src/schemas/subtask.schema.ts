import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ObjectId } from "mongodb";


@Schema({collection: 'subtasks'})
export class Subtask extends Document {

    

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({type: Types.ObjectId, ref: Subtask.name})
    taskId: ObjectId;

}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);