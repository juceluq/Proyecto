import { Routes } from '@angular/router';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ProductosComponent } from './components/productos/productos.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/pedidos',
        pathMatch: 'full'
    },
    {
        path: 'pedidos',
        component: PedidosComponent
    },
    {
        path: 'clientes',
        component: ClientesComponent
    },
    {
        path: 'productos',
        component: ProductosComponent
    },
    {
        path: '**',
        redirectTo: '/pedidos'
    }
];
