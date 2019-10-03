import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'

import { ETaskStatus } from '../task-status.enum'
import { UpdateTaskStatusDto } from '../dto'

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    ETaskStatus.open,
    ETaskStatus.inProgress,
    ETaskStatus.done,
  ]

  transform(value: UpdateTaskStatusDto, metadata: ArgumentMetadata) {
    const status = value.status.toUpperCase()

    if (!this.isStatusValid(status)) {
      throw new BadRequestException(`"${status}" is an invalid status`)
    }

    return value
  }

  private isStatusValid(status: any) {
    return this.allowedStatuses.indexOf(status) !== -1
  }
}
