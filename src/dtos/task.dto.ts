import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export default class TaskDto {

    declare id: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    @IsNotEmpty({message: 'Task name is required'})
    @ApiProperty(
        {
            required: true,
            example: 'Task name',
            type: String
        }
    )
    name: string;

    @IsNotEmpty({message: 'Task description is required'})
    @ApiProperty(
        {
            required: true,
            example: 'Task description',
            type: String
        }
    )
    description: string;

    @IsNotEmpty({message: 'Task due date is required'})
    @ApiProperty(
        {
            required: true,
            example: '2022-01-01T00:00:00.000Z',
            type: Date
        }
    )
    dueAt: Date;

    @IsNotEmpty({message: 'Task priority is required'})
    @ApiProperty(
        {
            required: true,
            example: 1,
            minimum: 0,
            maximum: 4,
            type: Number
        }
    )
    priority: number;
}