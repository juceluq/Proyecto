import { Injectable } from '@angular/core';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { TotalumApiService } from '../totalum-api-service.service';
import { Pedido } from '../../../models/pedido.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private sdk: TotalumApiSdk;

  constructor(private totalumApiService: TotalumApiService) {
    this.sdk = this.totalumApiService.getSdk();
  }

  async getPedidos(): Promise<any> {
    try {
      const response = await this.sdk.crud.getItems('pedidos', {
        sort: {
          createdAt: 1,
        },
        pagination: {
          page: 0,
          limit: 50,
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  }

  private async numPedidoExiste(
    num_pedido: number,
    pedidoId?: string
  ): Promise<boolean> {
    try {
      const response = await this.sdk.crud.getItems('pedidos', {
        pagination: {
          page: 0,
          limit: 50,
        },
      });

      const pedidoExistente = response.data.data.find(
        (pedido: Pedido) =>
          pedido.num_pedido === num_pedido && pedido.id !== pedidoId
      );

      return !!pedidoExistente;
    } catch (error) {
      console.error('Error al verificar el número de pedido:', error);
      return false;
    }
  }

  async createPedido(pedido: Pedido): Promise<any> {
    try {
      const numPedidoDuplicado = await this.numPedidoExiste(pedido.num_pedido);
      if (numPedidoDuplicado) {
        Swal.fire({
          icon: 'error',
          title: 'Número de Pedido Duplicado',
          text: 'Este número de pedido ya está registrado. Por favor, use otro.',
        });
        return;
      }
      const response = await this.sdk.crud.createItem('pedidos', pedido);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al actualizar pedido:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }

  async updatePedido(pedido: Pedido): Promise<any> {
    try {
      const numPedidoDuplicado = await this.numPedidoExiste(pedido.num_pedido, pedido.id);
      if (numPedidoDuplicado) {
        Swal.fire({
          icon: 'error',
          title: 'Número de Pedido Duplicado',
          text: 'Este número de pedido ya está registrado. Por favor, use otro.',
        });
        return;
      }
      const response = await this.sdk.crud.editItemById(
        'pedidos',
        pedido.id,
        pedido
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al crear pedido:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }

  async deletePedido(pedidoId: string): Promise<void> {
    try {
      const response = await this.sdk.crud.deleteItemById('pedidos', pedidoId);
      console.log(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al borrar pedido:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }
}
