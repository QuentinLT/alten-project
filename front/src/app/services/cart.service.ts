import { Injectable, inject, signal } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
}) export class CartService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/products";

  public cart = signal<Product[]>([]);

  public addToCart(product: Product): Observable<boolean> {
    return this.http.post<boolean>(this.path, product).pipe(
        catchError(() => {
            return of(true);
        }),
        tap(() => this.cart.update(cart => [product, ...cart])),
    );
  }

  public removeFromCart(productId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
        catchError(() => {
            return of(true);
        }),
        tap(() => {
          this.cart.update(cart => {
            const index = cart.findIndex(product => product.id === productId);
            if (index !== -1) {
              const updatedCart = [...cart];
              updatedCart.splice(index, 1);
              return updatedCart;
            }
          return cart;
          });
        }),
    );
  }

  public isInCart(productId: number): boolean {
    return this.cart().filter(item => item.id === productId).length > 0;
  }

  public canDeleteProduct(productId: number): boolean {
    return this.cart().length === 0 || !this.isInCart(productId);
  }

  public getQuantityInCart(productId: number): number {
    return this.cart().filter(item => item.id === productId).length;
  }  
}
