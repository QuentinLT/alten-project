import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { CurrencyPipe } from "@angular/common";
import { CartService } from "app/services/cart.service";
import { FormsModule } from '@angular/forms';

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [FormsModule, DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, CurrencyPipe],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  public readonly products = this.productsService.products;

  private readonly cartService = inject(CartService);

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  term: string = '';

  public cartProducts = this.cartService.cart;
  public isCartDialogVisible = false;

  ngOnInit() {
    this.productsService.get().subscribe();
    this.cartService.cartOpened$.subscribe(() => {
      this.openCartDialog();
    });
  }

/* set(..) ne fonctionne pas sur products
  public onFilter() {
    const lowerCaseTerm = this.term.toLowerCase();
    this.products.set(this.products().filter(product => product.name.toLowerCase().includes(lowerCaseTerm)));
  }
*/

  public openCartDialog() {
    this.isCartDialogVisible = true;
  }

  public closeCartDialog() {
    this.isCartDialogVisible = false;
  }

  public getCartProducts() {
    return this.cartService.getCartProducts();
  }

  public getTotalPrice(): number {
    let total = 0;
    for (let cartProduct of this.getCartProducts()) {
        total += cartProduct.product.price * cartProduct.quantity;
    }
    return total;
}


  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  public addToCart(product: Product) {
    this.cartService.addToCart(product).subscribe();
  }

  public removeFromCart(product: Product) {
    this.cartService.removeFromCart(product.id).subscribe();
  }

  public isInCart(product: Product): boolean {
    return this.cartService.isInCart(product.id);
  }

  public canDeleteProduct(product: Product): boolean {
    return this.cartService.canDeleteProduct(product.id);
  }

  public getQuantityInCart(product: Product): number {
    return this.cartService.getQuantityInCart(product.id);
  }
}
