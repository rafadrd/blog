# Dependencies

The project utilizes the following core libraries:
*   **react:** UI component library.
*   **react-router-dom:** Client-side routing.
*   **vite:** Build tool and development server.

# Configuration

Configuration is managed via environment variables.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | The base URL for backend API requests. | `/api` |

In the development environment, `vite.config.js` is configured to proxy requests starting with `/api` to `http://localhost:3000`. In the production environment, Nginx handles this routing.

# Installation and execution

### Local development

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

3.  Lint the codebase:
    ```bash
    npm run lint
    ```

### Production build

To generate static assets for deployment:

```bash
npm run build
```

The compiled files are output to the `dist/` directory.

# Docker deployment

The application uses a multi-stage Docker build process defined in `Dockerfile`.

1.  **Build Stage:** A Node.js container installs dependencies and compiles the React application using `npm run build`.
2.  **Serve Stage:** An Nginx Alpine container serves the static files from the `dist/` directory.

### Nginx configuration

The container uses a custom `nginx.conf` to handle routing:
*   **Static Content:** Requests to the root (`/`) are served from `/usr/share/nginx/html`.
*   **SPA Routing:** `try_files` is configured to redirect unknown routes to `index.html`, enabling client-side routing.
*   **API Proxy:** Requests matching `/api/` are forwarded to the backend service (host `backend` on port 3000).

To build and run the container:

```bash
docker build -t blog-frontend .
docker run -p 80:80 blog-frontend
```

# Project structure

*   `src/api`: Contains the HTTP client and fetch functions.
*   `src/components`: Reusable UI elements (Navbar, ArticleCard).
*   `src/hooks`: Custom React hooks, including `useFetch` for data retrieval.
*   `src/pages`: Top-level route components (Home, ArticlePage).
*   `src/App.css`: Global and component-specific styles.