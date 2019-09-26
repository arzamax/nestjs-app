import { Injectable, NotFoundException } from '@nestjs/common'
import * as uuid from 'uuid/v4'

import { ETaskStatus, ITask } from './task.model'
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskStatusDto } from './dto'

@Injectable()
export class TasksService {
  private tasks: ITask[] = []

  getAllTasks() {
    return this.tasks
  }

  getFilteredTasks(getTaskFilterDto: GetTasksFilterDto): ITask[] {
    const { status, search } = getTaskFilterDto
    let tasks = this.getAllTasks()

    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if (search) {
      tasks = tasks.filter(task =>
        task.title.includes(search) ||
        // tslint:disable-next-line:trailing-comma no-trailing-whitespace
        task.description.includes(search)
      )
    }

    return tasks
  }

  getTaskById(id: string): ITask {
    const found = this.tasks.find(task => task.id === id)

    if (!found) {
      throw new NotFoundException(`Task with ${id} ID is not found`)
    }

    return found
  }

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto

    const task: ITask = {
      id: uuid(),
      title,
      description,
      status: ETaskStatus.open,
    }

    this.tasks.push(task)
    return task
  }

  deleteTask(id: string) {
    const found = this.getTaskById(id)

    this.tasks = this.tasks.filter(task => task.id !== found.id)

    return this.tasks
  }

  updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto) {
    const found = this.getTaskById(id)
    found.status = updateTaskStatusDto.status

    return found
  }
}
