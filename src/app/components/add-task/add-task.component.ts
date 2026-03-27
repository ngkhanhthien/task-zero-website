import { Component, output } from '@angular/core';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html'
})
export class AddTaskComponent {
  // Thay thế EventEmitter bằng output() của Angular 21
  add = output<string>();

  onAdd(title: string, inputElement: HTMLInputElement): void {
    if (title.trim()) {
      this.add.emit(title.trim());
      inputElement.value = ''; // Reset the input field after emitting
    }
  }
}
