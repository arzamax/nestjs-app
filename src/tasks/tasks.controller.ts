import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { DeleteResult } from 'typeorm'
import { AuthGuard } from '@nestjs/passport'

import { TasksService } from './tasks.service'
import { CreateTaskDto, UpdateTaskStatusDto, GetTasksFilterDto } from './dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'
import { Task } from './task.entity'
import { GetUser } from '../auth/get-user.decorator'
import { User } from '../auth/user.entity'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController')
  constructor(private taskService: TasksService) {}

  @Get()
  async getTasks(
    @Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto,
    @GetUser() user,
  ) {
    this.logger.verbose(`User "${user.username}" is retrieving all tasks. Filters: ${JSON.stringify(getTasksFilterDto)}.`)
    return await this.taskService.getTasks(getTasksFilterDto, user)
  }

  @Get('/:id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user,
  ): Promise<Task> {
    return await this.taskService.getTaskById(id, user)
  }

  @Post()
  async createTask(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" is creating new task. Data: ${JSON.stringify(createTaskDto)}.`)
    return await this.taskService.createTask(createTaskDto, user)
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<DeleteResult> {
    return await this.taskService.deleteTask(id, user)
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.taskService.updateTaskStatus(id, updateTaskStatusDto, user)
  }
}
