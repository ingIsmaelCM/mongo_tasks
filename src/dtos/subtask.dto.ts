import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export default class SubtaskDto {

    declare id: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    @IsNotEmpty({message: 'Subtask name is required'})
    @ApiProperty(
        {
            required: true,
            example: 'Subtask name',
            type: String
        }
    )
    name: string;

    @IsNotEmpty({message: 'Subtask description is required'})
    @ApiProperty(
        {
            required: true,
            example: 'Subtask description',
            type: String
        }
    )
    description: string;
    
    
}