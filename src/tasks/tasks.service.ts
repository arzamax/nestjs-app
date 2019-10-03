import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult } from 'typeorm'

import { CreateTaskDto, UpdateTaskStatusDto, GetTasksFilterDto } from './dto'
import { TaskRepository } from './task.repository'
import { Task } from './task.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(getTasksFilterDto)
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id)

    if (!found) {
      throw new NotFoundException(`Task with ${id} ID is not found`)
    }

    return found
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto)
  }

  async deleteTask(id: number): Promise<DeleteResult> {
    const result = await this.taskRepository.delete(id)

    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }

    return result
  }

  async updateTaskStatus(
    id: number,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const task = await this.getTaskById(id)

    task.status = updateTaskStatusDto.status
    await task.save()
    return task
  }
}
