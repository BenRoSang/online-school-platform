import { AppError } from '../../shared/errors/app-error.js'
import { ProgressRepository } from './progress.repository.js'

export class ProgressService {
  constructor(private readonly repository = new ProgressRepository()) {}
  async update(studentId: string, lessonId: string, completed: boolean) {
    if (!(await this.repository.findEnrolledLesson(studentId, lessonId))) {
      throw new AppError(403, 'ENROLMENT_REQUIRED', 'Enrolment is required to update lesson progress')
    }
    return this.repository.save(studentId, lessonId, completed)
  }
}
