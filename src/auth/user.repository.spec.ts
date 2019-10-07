import { Test } from '@nestjs/testing'
import { ConflictException } from '@nestjs/common'

import { UserRepository } from './user.repository'

const mockCredentialsDto = { username: 'testUsername', password: 'password' }

describe('UserRepository', () => {
  let userRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
      ],
    }).compile()

    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('signUp', () => {
    let save

    beforeEach(() => {
      save = jest.fn()
      userRepository.create = jest.fn().mockReturnValue({ save })
    })

    test('Signs up user with success', () => {
      save.mockResolvedValue(undefined)
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow()
    })

    test('Throws conflict exception', () => {
      save.mockResolvedValue({ code: '23505' })
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException)
    })
  })
})
