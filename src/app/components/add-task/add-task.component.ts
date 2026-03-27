import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html'
})
export class AddTaskComponent {
  @Output() add = new EventEmitter<string>();

  onAdd(title: string, inputElement: HTMLInputElement): void {
    if (title.trim()) {
      this.add.emit(title.trim());
      inputElement.value = ''; // Reset input field after emitting
    }
  }
}
