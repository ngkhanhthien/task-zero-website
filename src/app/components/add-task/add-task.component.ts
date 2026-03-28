import { Component, ElementRef, output, viewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html'
})
export class AddTaskComponent {
  add = output<string>();

  // Use new Angular viewChild signal query instead of @ViewChild
  inputRef = viewChild<ElementRef<HTMLInputElement>>('taskInput');

  constructor() {
    afterNextRender(() => {
      this.inputRef()?.nativeElement.focus();
    });
  }

  onAdd(): void {
    const input = this.inputRef()?.nativeElement;
    if (!input) return;

    const title = input.value.trim();
    if (title) {
      this.add.emit(title);
      input.value = ''; // Reset the input field
    }
  }
}
