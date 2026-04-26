import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
        title: "Home"
    },
    {
        path: "shop",
        loadComponent: () => import('./features/shop/shop.component').then(c => c.ShopComponent),
        title: "Shop"
    },
    {
        path: "categories",
        loadComponent: () => import('./features/categories/categories.component').then(c => c.CategoriesComponent),
        title: "Categories"
    },
    {
        path: "brands",
        loadComponent: () => import('./features/brands/brands.component').then(c => c.BrandsComponent),
        title: "Brands"
    },
    {
        path: "brandDetails/:id",
        loadComponent: () => import('./features/brand-details/brand-details.component').then(c => c.BrandDetailsComponent),
        title: "Brand Details"
    },
    {
        path: "wishlist",
        loadComponent: () => import('./features/wishlist/wishlist.component').then(c => c.WishlistComponent),
        title: "Wishlist"
    },
    {
        path: "cart",
        loadComponent: () => import('./features/cart/cart.component').then(c => c.CartComponent),
        title: "Cart"
    },
    {
        path: "details/:id/:slug",
        loadComponent: () => import('./features/details/details.component').then(c => c.DetailsComponent),
        title: "Details"
    },
    {
        path: "categories/:id",
        loadComponent: () => import('./features/category-details/category-details.component').then(c => c.CategoryDetailsComponent),
        title: "Category Details"
    },
    {
        path: "checkout/:id",
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/checkout.component').then(c => c.CheckoutComponent),
        title: "Checkout"
    },
    {
        path: "allorders",
        canActivate: [authGuard],
        loadComponent: () => import('./features/orders/orders.component').then(c => c.OrdersComponent),
        title: "Orders"
    },
    {
        path: "login",
        loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent),
        title: "Login"
    },
    {
        path: "register",
        loadComponent: () => import('./features/register/register.component').then(c => c.RegisterComponent),
        title: "Register"
    },
    {
        path: "forgot",
        loadComponent: () => import('./features/forgot/forgot.component').then(c => c.ForgotComponent),
        title: "Forgot Password"
    },
    {
        path: "contact",
        loadComponent: () => import('./features/contact-us/contact-us.component').then(c => c.ContactUsComponent),
        title: "Contact"
    },
    {
        path: "help",
        loadComponent: () => import('./features/help-center/help-center.component').then(c => c.HelpCenterComponent),
        title: "Help"
    },
    {
        path: "**",
        loadComponent: () => import('./features/notfound/notfound.component').then(c => c.NotfoundComponent),
        title: "Not Found"
    },
];

