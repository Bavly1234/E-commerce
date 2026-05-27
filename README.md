# E-commerce Angular Store

A professional, server-side rendered Angular e-commerce storefront built with Angular 21, Tailwind CSS, Flowbite and FontAwesome. This repository contains the complete frontend and SSR configuration for a shopping platform with product browsing, categories, cart management, checkout flow, and authentication-ready routing.

## Features

- Angular 21 application with SSR support
- Responsive product catalog and category pages
- Cart and checkout workflows
- Reusable layout components for navbar and footer
- Toast notifications, loading spinner, and pagination
- Tailwind CSS and Flowbite UI styling
- FontAwesome icon integration

## Built with

- Angular 21
- Angular SSR
- Tailwind CSS
- Flowbite
- ngx-spinner
- ngx-toastr
- Swiper
- FontAwesome

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later

## Setup

```bash
npm ci
```

## Local development

```bash
npm start
```

Open `http://localhost:4200/` in your browser.

## Production preview

```bash
npm run preview
```

## Build

```bash
npm run build
```

## SSR production server

Build the application, then start the SSR server:

```bash
npm run build
npm run serve:ssr
```

## Test

Run the test suite:

```bash
npm test
```

Run tests once for CI:

```bash
npm run test:ci
```

## Formatting

Format source files with Prettier:

```bash
npm run format
```

## Repository structure

- `src/` — Angular application source code
- `public/` — static assets
- `dist/` — generated build output
- `.github/workflows/ci.yml` — GitHub Actions CI pipeline

## Contributing

Contributions are welcome. Please fork the repo, create a feature branch, and open a pull request.

## License

This project is licensed under the MIT License.
