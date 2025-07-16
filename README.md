# NNM Object Viewer

_NNM Object Viewer_ is a convenient tool that displays a JSON object as an object tree. The tool handles objects and arrays.

You automatically get helpful information about the actual data, which will help you analysing the content and comparing it to other objects.

The [official version of _NNM Object Viewer_](https://anders.nemonisimors.com/projects/objectViewer).

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```
