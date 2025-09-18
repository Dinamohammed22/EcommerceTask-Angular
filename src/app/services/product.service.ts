// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:44359/FilterProductsEndpoint/FilterProducts';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      // Extract the items array from the data property
      map(response => response.data.items || []),
      // Map each item to the Product interface
      map((items: any[]) => items.map(item => ({
        id: item.id,
        productName: item.productName,
        category: item.category || 'Uncategorized',
        price: item.price,
        productCode: item.productCode || '',
        discountRate: item.discountRate || 0,
        minimumQuantity: item.minimumQuantity,
        path: item.path
      }))),
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }
}