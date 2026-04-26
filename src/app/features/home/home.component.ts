import { Component } from '@angular/core';
import { SliderComponent } from './components/slider/slider.component';
import { ProductHomeComponent } from './components/product-home/product-home.component';
import { CategoryHomeComponent } from './components/category-home/category-home.component';

@Component({
  selector: 'app-home',
  imports: [SliderComponent,ProductHomeComponent,CategoryHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
