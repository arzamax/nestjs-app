import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'

import { TasksService } from './tasks.service'
import { ITask } from './task.model'
import { CreateTaskDto, UpdateTaskStatusDto, GetTasksFilterDto } from './dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto): ITask[] {
    if (Object.keys(getTasksFilterDto).length) {
      return this.taskService.getFilteredTasks(getTasksFilterDto)
    }
    return this.taskService.getAllTasks()
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto)
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id)
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body(null, TaskStatusValidationPipe) updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.taskService.updateTaskStatus(id, updateTaskStatusDto)
  }
}
