import { Course } from "./course";

export interface CoursePage {
  content: Course[],
  totalElements: number;
  totalPages: number;
}
