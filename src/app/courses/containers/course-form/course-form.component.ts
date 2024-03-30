import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {
  form = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    category: ['']
  })

  constructor(private formBuilder: NonNullableFormBuilder, private service: CoursesService, private snackBar: MatSnackBar, private location: Location, private route: ActivatedRoute){}

  ngOnInit() {
    const course: Course = this.route.snapshot.data['course'];
    this.form.setValue({id: course.id, name: course.name, category: course.category})
  }

  onSubmit() {
    this.service.save(this.form.value).subscribe({
      next: () => this.onSuccess(),
      error: () => this.snackBar.open("Erro ao tentar salvar")
    })
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this.snackBar.open('Curso criado com sucesso')
    this.location.back();
  }
}
