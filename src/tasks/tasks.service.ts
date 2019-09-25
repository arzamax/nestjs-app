import { Injectable } from '@nestjs/common'
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
        task.description.includes(search)
      )
    }

    return tasks
  }

  getTaskById(id: string): ITask {
    return this.tasks.find(task => task.id === id)
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
    this.tasks = this.tasks.filter(task => task.id !== id)
    return this.tasks
  }

  updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto) {
    const task = this.tasks.find(item => item.id === id)

    if (task) {
      task.status = updateTaskStatusDto.status
      return task
    }
    return null
  }
}
