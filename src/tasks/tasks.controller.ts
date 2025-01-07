import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiBody } from '@nestjs/swagger';
import TaskDto from 'src/dtos/task.dto';
import { QueryParams } from 'src/types/query.params';

@Controller('tasks')
export class TasksController {
    constructor(
        protected readonly tasksService: TasksService
    ) {}

    @Get()
    async getAllTasks(@Query('includeSubtasks') includeSubtasks: boolean = false, @Query() query: QueryParams){
        return await this.tasksService.getAllTasks(includeSubtasks, query);
    }
    @Get(':id')
    async getTaskById(@Param('id') id: string){
        return await this.tasksService.getTaskById(id);
    }

    @Post()
    @ApiBody({type: TaskDto})
    async createTask(@Body() task: TaskDto){
        return await this.tasksService.createTask(task);
    }

    @Put(":id")
    @ApiBody({type: TaskDto})
    async updateTask(@Body() task: TaskDto, @Param('id') id: string){
        return this.tasksService.updateTask(id, task);
    }

    @Delete(":id")
    async deleteTask(@Param('id') id: string){
        return await this.tasksService.deleteTask(id);
    }

}
