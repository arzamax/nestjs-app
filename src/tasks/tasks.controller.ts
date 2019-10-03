import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common'
import { DeleteResult } from 'typeorm'

import { TasksService } from './tasks.service'
import { CreateTaskDto, UpdateTaskStatusDto, GetTasksFilterDto } from './dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'
import { Task } from './task.entity'

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getTasks(@Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto) {
    return await this.taskService.getTasks(getTasksFilterDto)
  }

  @Get('/:id')
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.taskService.getTaskById(id)
  }

  @Post()
  async createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto)
  }

  @Delete('/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.taskService.deleteTask(id)
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return await this.taskService.updateTaskStatus(id, updateTaskStatusDto)
  }
}
