export enum ETaskStatus {
  open = 'OPEN',
  inProgress = 'IN_PROGRESS',
  done = 'DONE',
}

export interface ITask {
  id: string
  title: string
  description: string
  status: ETaskStatus
}
