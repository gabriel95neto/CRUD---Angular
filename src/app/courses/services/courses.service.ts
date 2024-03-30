import { Course } from './../model/course';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'

import { first, tap } from 'rxjs';
import { CoursePage } from '../model/coursePage';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = '/api/courses'

  constructor(private httpClient: HttpClient) {}

  findAllCourses() {
    return this.httpClient.get<CoursePage>(this.API).pipe(
      first()
    )
  }

  loadById(id: string) {
    return this.httpClient.get<Course>(`${this.API}/${id}`).pipe(first());
  }

  save(record: Partial<Course>) {

    if(record.id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Course>) {
    return this.httpClient.post<Course>(this.API, record).pipe(first())
  }

  private update(record: Partial<Course>) {
    return this.httpClient.put<Course>(`${this.API}/${record.id}`, record).pipe(first())
  }

  remove(id: string) {
    return this.httpClient.delete<Course>(`${this.API}/${id}`).pipe(first());
  }

}
