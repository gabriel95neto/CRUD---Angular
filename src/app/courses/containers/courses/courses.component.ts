import { Component } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { CoursePage } from '../../model/coursePage';
import { Course } from '../../model/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
  courses$: Observable<CoursePage> | null = null;

  constructor(private courseService: CoursesService, public dialog:MatDialog, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar){
    this.refresh();
  }

  onError(message: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: message
    });
  }

  refresh() {
    this.courses$ = this.courseService.findAllCourses().pipe(
      catchError(error => {
        this.onError("Erro ao Carregar cursos")
        return of({content: [], totalElements: 0, totalPages: 0 })
      })
    )
  }

  onAdd() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course.id], {relativeTo: this.route})
  }

  onRemove(course: Course) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: "Tem certeza que seja remover esse curso ?",
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.remove(course.id).subscribe({
          next: () => {
            this.snackBar.open('Curso removido com sucesso');
            this.refresh();
          },
          error: () => this.onError("Erro ao tentar remover o curso")
        })
      }
    });
  }
}
