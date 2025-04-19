import { Component, OnInit } from '@angular/core';
import { TablaComponent } from '../tabla/tabla.component';
import { Pedido } from '../../models/pedido.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PedidoService } from '../../services/totalum-api-service/pedidos/pedido.service';

@Component({
  selector: 'app-pedidos',
  imports: [TablaComponent],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent {
  columnasPedidos = [
    { campo: 'num_pedido', cabecera: 'Num Pedido', tipo: 'number' },
    { campo: 'importe', cabecera: 'Importe (€)', tipo: 'number' },
    {
      campo: 'importe_impuestos',
      cabecera: 'Importe Impuestos (€)',
      tipo: 'number',
    },
    { campo: 'cantidad', cabecera: 'Cantidad', tipo: 'number' },
    { campo: 'fecha', cabecera: 'Fecha', tipo: 'date' },
    { campo: 'nombre_cliente', cabecera: 'Cliente', tipo: 'text' },
  ];

  pedidos: Pedido[] = [];
  formularioPedidos!: FormGroup;
  pedidoEditando: Pedido | null = null;

  constructor(private PedidoService: PedidoService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.PedidoService.getPedidos()
      .then((data) => {
        this.pedidos = data;
      })
      .catch((error) => {
        console.error('Error al obtener pedidos:', error);
      });

    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.formularioPedidos = this.fb.group({
      id: [''],
      num_pedido: ['', Validators.required],
      importe: ['', [Validators.required, Validators.min(0)]],
      importe_impuestos: ['', [Validators.required, Validators.min(0)]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      fecha: [null, Validators.required],
      nombre_cliente: ['', Validators.required],
    });
  }

  nuevoPedido() {
    this.pedidoEditando = null;
    this.formularioPedidos.reset();
  }

  editarPedido(pedido: Pedido) {
    this.pedidoEditando = pedido;
    this.formularioPedidos.patchValue({
      ...pedido,
      fecha: pedido.fecha ? new Date(pedido.fecha) : null,
    });
  }

  async guardarPedido() {
    const pedido = this.formularioPedidos.value;

    if (this.pedidoEditando) {
      try {
        const actualizado = await this.PedidoService.updatePedido(pedido);
        if (actualizado) {
          Object.assign(this.pedidoEditando, pedido);
          Swal.fire(
            'Actualizado',
            'Pedido actualizado correctamente',
            'success'
          );
        }
      } catch (error) {
        console.error('Error al actualizar pedido:', error);
      }
    } else {
      try {
        const nuevoPedido = await this.PedidoService.createPedido(pedido);
        const id = nuevoPedido.data.insertedId;
        const pedidoConId = { ...pedido, id };
        this.pedidos = [...this.pedidos, pedidoConId];
        Swal.fire('Creado', 'Pedido creado correctamente', 'success');
      } catch (error) {
        console.error('Error al crear pedido:', error);
      }
    }
  }

  async eliminarPedido(pedido: Pedido) {
    const confirm = await Swal.fire({
      title: '¿Eliminar pedido?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    });

    if (confirm.isConfirmed) {
      try {
        await this.PedidoService.deletePedido(pedido.id);
        this.pedidos = this.pedidos.filter((p) => p.id !== pedido.id);
        Swal.fire('Eliminado', 'Pedido eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar pedido:', error);
      }
    }
  }
}
