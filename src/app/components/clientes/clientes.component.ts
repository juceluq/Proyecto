import { Component, OnInit } from '@angular/core';
import { TablaComponent } from '../tabla/tabla.component';
import { Cliente } from '../../models/cliente.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClienteService } from '../../services/totalum-api-service/clientes/cliente.service';

@Component({
  selector: 'app-clientes',
  imports: [TablaComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements OnInit {
  columnasClientes = [
    { campo: 'nombre', cabecera: 'Nombre', tipo: 'text' },
    { campo: 'fecha_nacimiento', cabecera: 'Fecha de Nacimiento', tipo: 'date' },
    { campo: 'email', cabecera: 'Email', tipo: 'email' },
    { campo: 'telefono', cabecera: 'Teléfono', tipo: 'number' },
  ];

  clientes: Cliente[] = [];
  formularioCliente!: FormGroup;
  clienteEditando: Cliente | null = null;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.clienteService
      .getClientes()
      .then((data) => {
        this.clientes = data;
      })
      .catch((error) => {
        console.error('Error al obtener clientes:', error);
      });

    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.formularioCliente = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      fecha_nacimiento: [null],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
    });
  }

  nuevoCliente() {
    this.clienteEditando = null;
    this.formularioCliente.reset();
  }

  editarCliente(cliente: Cliente) {
    this.clienteEditando = cliente;
    this.formularioCliente.patchValue({
      ...cliente,
      fecha_nacimiento: cliente.fecha_nacimiento ? new Date(cliente.fecha_nacimiento) : null,
    });
  }
  

  async guardarCliente() {
    const cliente = this.formularioCliente.value;

    if (this.clienteEditando) {
      try {
        await this.clienteService.updateCliente(cliente);
        Object.assign(this.clienteEditando, cliente);
        Swal.fire(
          'Actualizado',
          'cliente actualizado correctamente',
          'success'
        );
      } catch (error) {
        console.error('Error al actualizar cliente:', error);
      }
    } else {
      try {
        const nuevocliente = await this.clienteService.createCliente(cliente);
        const id = nuevocliente.data.insertedId;
        const clienteConId = { ...cliente, id };
        this.clientes = [...this.clientes, clienteConId];
        Swal.fire('Creado', 'cliente creado correctamente', 'success');
      } catch (error) {
        console.error('Error al crear cliente:', error);
      }
    }
  }

  async eliminarCliente(cliente: Cliente) {
    const confirm = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    });

    if (confirm.isConfirmed) {
      try {
        await this.clienteService.deleteCliente(cliente.id);
        this.clientes = this.clientes.filter((p) => p.id !== cliente.id);
        Swal.fire('Eliminado', 'cliente eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  }
}
