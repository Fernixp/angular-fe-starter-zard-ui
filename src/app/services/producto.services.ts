import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  estado: 'activo' | 'inactivo';
  created_at: string;
  updated_at: string;
}

export interface ProductoCreateDto {
  nombre: string;
  precio: number;
  categoria_id: number;
  estado: 'activo' | 'inactivo';
}

export interface ProductoUpdateDto extends ProductoCreateDto {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8000/api/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  createProducto(producto: ProductoCreateDto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: ProductoUpdateDto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}