# Dependencies

The application relies on the following primary libraries:
*   **express:** Web server framework.
*   **pg:** PostgreSQL client for Node.js.
*   **node-cron:** Task scheduler for periodic article generation.
*   **dotenv:** Environment variable management.
*   **cors:** Cross-Origin Resource Sharing middleware.

# Configuration

The application requires specific environment variables for operation. These are defined in `.env` for local development or injected via the container environment in production.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | The port on which the server listens. | `3000` |
| `NODE_ENV` | The application environment (`development` or `production`). | `development` |
| `DATABASE_URL` | PostgreSQL connection string. | `postgres://postgres:password@localhost:5432/blog_db` |
| `FRONTEND_URL` | Allowed origin for CORS requests. | `http://localhost:5173` |
| `OPENROUTER_API_KEY` | API key for the AI provider. | None |
| `AI_MODEL_NAME` | The specific model identifier to use. | `openai/gpt-oss-20b:free` |
| `OPENROUTER_API_URL` | Endpoint for the AI completion API. | `https://openrouter.ai/api/v1/chat/completions` |
| `CRON_SCHEDULE` | Cron expression for the generation job. | `0 0 * * *` (Daily at midnight) |
| `ARTICLE_TOPICS` | Comma-separated list of topics for generation. | (Internal defaults used if empty) |

# Installation and execution

### Local development

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server with watch mode:
    ```bash
    npm run dev
    ```

3.  Start the server in production mode:
    ```bash
    npm start
    ```

### Docker

The provided `Dockerfile` uses a multi-stage build process.

1.  Build the image:
    ```bash
    docker build -t blog-backend .
    ```

2.  Run the container:
    ```bash
    docker run -p 3000:3000 --env-file .env blog-backend
    ```

# API endpoints

The service exposes the following HTTP endpoints under the `/articles` path.

### Get all articles
*   **URL:** `/articles`
*   **Method:** `GET`
*   **Response:** Returns a JSON array of article objects containing `id`, `title`, and `created_at`. Content is omitted for list performance.

### Get article by ID
*   **URL:** `/articles/:id`
*   **Method:** `GET`
*   **Response:** Returns a single JSON object containing the full article details, including `content`.
*   **Errors:** Returns `404` if the ID does not exist.

# Background processes

### Database initialization
Upon startup, the application attempts to connect to the configured PostgreSQL instance. It executes a `CREATE TABLE IF NOT EXISTS` query to ensure the `articles` schema exists.

### Content seeding
The system checks the record count in the `articles` table on startup. If the count is below the configured threshold (default: 3), the system triggers immediate content generation loops until the minimum count is met.

### Scheduled generation
A cron job runs according to the `CRON_SCHEDULE` variable. When triggered, it:
1.  Selects a random topic from the configuration.
2.  Sends a prompt to the OpenRouter API.
3.  Saves the returned text to the database.