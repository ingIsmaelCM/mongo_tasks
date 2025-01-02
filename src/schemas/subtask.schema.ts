import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema()
export class Subtask extends Document {

    

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({type: Types.ObjectId, ref: Subtask.name})
    taskId: string;

}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);