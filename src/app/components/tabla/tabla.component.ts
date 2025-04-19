import { DatePipe, DecimalPipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [
    TableModule,
    NgFor,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    DatePipe,
    DatePickerModule,
    CalendarModule,
    NgIf,
  ],
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TablaComponent {
  @ViewChild('tabla') tabla!: Table;

  @Input() columnas: { campo: string; cabecera: string; tipo: string }[] = [];
  @Input() dialogHeader: string = 'Crear';
  @Input() datos: any[] = [];
  @Input() nombre: string = '';
  @Input() formulario!: FormGroup;

  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<void>();

  dialogVisible: boolean = false;
  modo: 'nuevo' | 'editar' = 'nuevo';

  get globalFilterFields(): string[] {
    return this.columnas.map((col) => col.campo);
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.tabla.filterGlobal(input.value, 'contains');
  }

  itemSeleccionado: any = null;

  constructor() {}

  abrirDialogo() {
    this.modo = 'nuevo';
    this.onAdd.emit();
    this.dialogVisible = true;
  }

  editarDialogo(item: any) {
    this.modo = 'editar';
    this.onEdit.emit(item);
    this.dialogVisible = true;
  }

  eliminarElemento(item: any) {
    this.onDelete.emit(item);
  }

  guardar() {
    this.onSave.emit();
    this.dialogVisible = false;
  }
}
