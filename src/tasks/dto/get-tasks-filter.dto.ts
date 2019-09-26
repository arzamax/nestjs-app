import { IsIn, IsOptional, IsString } from 'class-validator'

import { ETaskStatus } from '../task.model'

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([ ETaskStatus.open, ETaskStatus.done, ETaskStatus.inProgress ])
  status?: ETaskStatus

  @IsOptional()
  search?: string
}
