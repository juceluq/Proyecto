export interface Pedido {
    id: string;
    num_pedido: number;
    importe: number;
    importe_impuestos: number;
    cantidad: number;
    fecha: Date;
    nombre_cliente: string;
}