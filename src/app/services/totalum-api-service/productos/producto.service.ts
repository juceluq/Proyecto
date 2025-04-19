import { Injectable } from '@angular/core';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { TotalumApiService } from '../totalum-api-service.service';
import { Producto } from '../../../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private sdk: TotalumApiSdk;

  constructor(private totalumApiService: TotalumApiService) {
    this.sdk = this.totalumApiService.getSdk();
  }

  async getProductos(): Promise<any> {
    try {
      const response = await this.sdk.crud.getItems('productos', {
        sort: {
          createdAt: 1,
        },
        pagination: {
          page: 0,
          limit: 50,
        },
      });
      console.log(response.data.data);
      
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  }

  async createProducto(producto: Producto): Promise<any> {
    try {
      const response = await this.sdk.crud.createItem('productos', producto);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al crear producto:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }

  async updateProducto(producto: Producto): Promise<Producto> {
    try {
      const response = await this.sdk.crud.editItemById(
        'productos',
        producto.id,
        producto
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al actualizar producto:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }

  async deleteProducto(productoId: string): Promise<void> {
    try {
      const response = await this.sdk.crud.deleteItemById(
        'productos',
        productoId
      );
      console.log(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al borrar producto:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  }
}
