import { Test } from '@nestjs/testing'

import { TasksService } from './tasks.service'
import { TaskRepository } from './task.repository'
import { GetTasksFilterDto } from './dto'
import { ETaskStatus } from './models/task-status.enum'

const mockUser = { id: 1, username: 'testUser' }

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
})

describe('TaskService', () => {
  let taskService
  let taskRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile()

    taskService = await module.get(TasksService)
    taskRepository = await module.get(TaskRepository)
  })

  describe('getTasks', () => {
    test('Gets all tasks from repository', async () => {
      taskRepository.getTasks.mockResolvedValue('value')

      expect(taskRepository.getTasks).not.toHaveBeenCalled()
      const filters: GetTasksFilterDto = {
        status: ETaskStatus.inProgress,
        search: 'search',
      }
      const result = await taskService.getTasks(filters, mockUser)
      expect(taskRepository.getTasks).toHaveBeenCalled()
      expect(result).toEqual('value')
    })
  })

  describe('getTasksById', () => {
    test('Calls taskRepository.findOne() and return data with success', async () => {
      const mockTask = { title: 'title', description: 'description' }
      taskRepository.findOne.mockResolvedValue(mockTask)

      const result = await taskService.getTaskById(1, mockUser)

      expect(result).toEqual(mockTask)
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      })
    })

    test('Throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null)
      expect(taskService.getTaskById(1, mockUser)).rejects.toThrow()
    })
  })
})
