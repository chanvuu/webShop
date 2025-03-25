import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceFormatPipe } from './pipes/price-format.pipe';
import { RouterModule } from '@angular/router';
import { ProductComponent } from "./components/product/product.component";
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, ProductComponent, HeaderComponent, ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Product Demo';
}
