import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult } from 'typeorm'

import { CreateTaskDto, UpdateTaskStatusDto, GetTasksFilterDto } from './dto'
import { TaskRepository } from './task.repository'
import { Task } from './task.entity'
import { User } from '../auth/user.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return await this.taskRepository.getTasks(getTasksFilterDto, user)
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne(
      { where: { id, userId: user.id } },
    )

    if (!found) {
      throw new NotFoundException(`Task with ${id} ID is not found`)
    }

    return found
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user)
  }

  async deleteTask(id: number, user: User): Promise<DeleteResult> {
    const result = await this.taskRepository.delete(
      { id, userId: user.id },
    )

    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }

    return result
  }

  async updateTaskStatus(
    id: number,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user)

    task.status = updateTaskStatusDto.status
    await task.save()
    return task
  }
}
