import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import SubtaskDto from 'src/dtos/subtask.dto';

@Controller('subtasks')
export class SubtaskController {
    constructor(
        protected readonly subtaskService: SubtaskService
    ) { }

    @ApiParam({ name: 'id', type: String, required: false })
    @Get("tasks/:id?")
    async getAllSubtasks(@Param('id') id?: string) {
        return await this.subtaskService.getAllSubtasks(id);
    }

    @ApiParam({ name: 'id', type: String, required: true })
    @Get(":id")
    async getSubtaskById(@Param('id') id: string) {
        return await this.subtaskService.getSubtaskById(id);
    }


    @ApiBody({ type: SubtaskDto })
    @Post("tasks/:id")
    async createSubtask(@Param('id') id: string, @Body() subtask: SubtaskDto) {
        return await this.subtaskService.createSubtask(id, subtask);
    }

    @ApiBody({ type: SubtaskDto })
    @ApiParam({ name: 'id', type: String, required: true })
    @Put(":id")
    async updateSubtask(@Param('id') id: string, @Body() subtask: SubtaskDto) {
        return await this.subtaskService.updateSubtask(id, subtask);
    }

    @ApiParam({ name: 'id', type: String, required: true })
    @Delete(":id")
    async deleteSubtask(@Param('id') id: string) {
        return await this.subtaskService.deleteSubtask(id);
    }
}
