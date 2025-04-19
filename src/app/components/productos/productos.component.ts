import { Component, OnInit } from '@angular/core';
import { TablaComponent } from '../tabla/tabla.component';
import { Producto } from '../../models/producto.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/totalum-api-service/productos/producto.service';

@Component({
  selector: 'app-productos',
  imports: [TablaComponent, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit {
  columnasProductos = [
    { campo: 'nombre', cabecera: 'Nombre', tipo: 'text' },
    { campo: 'precio', cabecera: 'Precio (€)', tipo: 'number' },
    { campo: 'categoria', cabecera: 'Categoría', tipo: 'text' },
    { campo: 'cantidad', cabecera: 'Stock', tipo: 'number' },
  ];

  productos: Producto[] = [];
  formularioProducto!: FormGroup;
  productoEditando: Producto | null = null;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productoService
      .getProductos()
      .then((data) => {
        this.productos = data;
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
      });

    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.formularioProducto = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]],
    });
  }

  nuevoProducto() {
    this.productoEditando = null;
    this.formularioProducto.reset();
  }

  editarProducto(producto: Producto) {
    this.productoEditando = producto;
    this.formularioProducto.patchValue(producto);
  }

  async guardarProducto() {
    const producto = this.formularioProducto.value;

    if (this.productoEditando) {
      try {
        await this.productoService.updateProducto(producto);
        Object.assign(this.productoEditando, producto);
        Swal.fire(
          'Actualizado',
          'Producto actualizado correctamente',
          'success'
        );
      } catch (error) {
        console.error('Error al actualizar producto:', error);
      }
    } else {
      try {
        const nuevoProducto = await this.productoService.createProducto(producto);
        const id = nuevoProducto.data.insertedId;
        const productoConId = { ...producto, id };
        this.productos = [...this.productos, productoConId];
        Swal.fire('Creado', 'Producto creado correctamente', 'success');
      } catch (error) {
        console.error('Error al crear producto:', error);
      }
    }
  }

  async eliminarProducto(producto: Producto) {
    const confirm = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    });

    if (confirm.isConfirmed) {
      try {
        await this.productoService.deleteProducto(producto.id);
        this.productos = this.productos.filter((p) => p.id !== producto.id);
        Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  }
}
