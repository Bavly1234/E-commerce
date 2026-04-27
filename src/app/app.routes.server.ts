// import { RenderMode, ServerRoute } from '@angular/ssr';

// export const serverRoutes: ServerRoute[] = [
//   {
//     path: '**',
//     renderMode: RenderMode.Prerender
//   }
// ];








import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'brandDetails/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'details/:id/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'categories/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];