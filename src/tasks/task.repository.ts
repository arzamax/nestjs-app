import { EntityRepository, Repository } from 'typeorm'
import { InternalServerErrorException, Logger } from '@nestjs/common'

import { Task } from './task.entity'
import { CreateTaskDto, GetTasksFilterDto } from './dto'
import { ETaskStatus } from './models/task-status.enum'
import { User } from '../auth/user.entity'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger()
  async getTasks(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = getTasksFilterDto
    const query = this.createQueryBuilder('task')

    query.where('task.userId = :userId', { userId: user.id })

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
        )
    }

    try {
      return await query.getMany()
    } catch (e) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(getTasksFilterDto)}`,
        e.stack,
      )
      throw new InternalServerErrorException()
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto
    const task = new Task()

    task.title = title
    task.description = description
    task.status = ETaskStatus.open
    task.user = user

    await task.save()
    delete task.user

    return task
  }
}
