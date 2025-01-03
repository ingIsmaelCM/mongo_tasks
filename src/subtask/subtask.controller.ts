import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import SubtaskDto from 'src/dtos/subtask.dto';
import fetchData from 'src/fetch.data'

@Controller('subtasks')
export class SubtaskController {
    constructor(
        protected readonly subtaskService: SubtaskService
    ) { 
      
    }

    @ApiQuery({ name: 'taskId', type: String, required: false })
    @Get()
    async getAllSubtasks(@Query('taskId') id?: string) {
        
        return await this.subtaskService.getAllSubtasks(id);
    }

    @ApiParam({ name: 'id', type: String, required: true })
    @Get(":id")
    async getSubtaskById(@Param('id') id: string) {
        fetchData()
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
