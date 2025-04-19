import { Injectable } from '@angular/core';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { TotalumApiService } from '../totalum-api-service.service';
import { Cliente } from '../../../models/cliente.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private sdk: TotalumApiSdk;

  constructor(private totalumApiService: TotalumApiService) {
    this.sdk = this.totalumApiService.getSdk();
  }

  async getClientes(): Promise<any> {
    try {
      const response = await this.sdk.crud.getItems('clientes', {
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

  private async emailExiste(
    email: string,
    clienteId?: string
  ): Promise<boolean> {
    try {
      const response = await this.sdk.crud.getItems('clientes', {
        pagination: {
          page: 0,
          limit: 50,
        },
      });

      const clienteExistente = response.data.data.find(
        (cliente: Cliente) =>
          cliente.email === email && cliente.id !== clienteId
      );

      return !!clienteExistente;
    } catch (error) {
      console.error('Error al verificar el email:', error);
      return false;
    }
  }

  async createCliente(cliente: Cliente): Promise<any> {
    try {
      const emailDuplicado = await this.emailExiste(cliente.email);
      if (emailDuplicado) {
        Swal.fire({
          icon: 'error',
          title: 'Correo electrónico ya en uso',
          text: 'Este correo electrónico ya está registrado. Por favor, use otro.',
        });
        return;
      }

      const response = await this.sdk.crud.createItem('clientes', cliente);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al crear cliente:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }

  async updateCliente(cliente: Cliente): Promise<Cliente> {
    try {
      const response = await this.sdk.crud.editItemById(
        'clientes',
        cliente.id,
        cliente
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al actualizar cliente:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }

  async deleteCliente(clienteId: string): Promise<void> {
    try {
      const response = await this.sdk.crud.deleteItemById(
        'clientes',
        clienteId
      );
      console.log(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al borrar cliente:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }
}
