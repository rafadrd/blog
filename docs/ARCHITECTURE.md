# System components

The application runs three primary containerized services managed via Docker Compose.

### Frontend
The frontend application is a single-page application (SPA) built with React and Vite. It runs within an Nginx container. Nginx performs two functions:
*   Serving static assets (HTML, CSS, JavaScript) on port 80.
*   Acting as a reverse proxy, forwarding requests matching the `/api` path to the backend service.

### Backend
The backend is a Node.js application using the Express framework. It exposes a RESTful API for article retrieval and management. The service includes an internal scheduler implemented with `node-cron`. This scheduler triggers a daily job that:
1.  Selects a topic from a predefined list or environment configuration.
2.  Requests content generation from the OpenRouter API.
3.  Persists the generated content to the PostgreSQL database.

### Database
Data persistence is handled by a PostgreSQL instance. The database schema consists of a single `articles` table storing titles, content, and creation timestamps. The database container mounts a host volume to ensure data persists across container restarts.

# Data flow

### User interaction
1.  A client requests the application via a web browser.
2.  Nginx serves the React application.
3.  The React application initiates asynchronous HTTP requests to `/api/articles`.
4.  Nginx proxies these requests to the backend container on port 3000.
5.  The backend queries the PostgreSQL database and returns JSON data.

### Content generation
1.  The `node-cron` scheduler executes at the configured time (default 00:00 UTC).
2.  The `ArticleJob` service selects a topic.
3.  The `aiClient` service sends a prompt to the OpenRouter API.
4.  Upon receiving a text response, the `ArticleRepository` inserts a new record into the database.

# Infrastructure

The production environment resides on Amazon Web Services (AWS).

### Compute and networking
*   **EC2:** A single t3.micro instance hosts the application. The instance runs Amazon Linux 2023 and contains the Docker engine.
*   **Security Groups:** Traffic is permitted on port 80 (HTTP) and port 22 (SSH).
*   **ECR:** Amazon Elastic Container Registry stores the versioned Docker images for the frontend and backend.

### CI/CD pipeline
Deployment automation utilizes AWS CodeBuild and AWS Systems Manager (SSM).

1.  **Source Control:** Changes pushed to the repository trigger the build process.
2.  **Build (CodeBuild):**
    *   Authenticates with ECR.
    *   Builds Docker images for the frontend and backend using the `latest` tag.
    *   Pushes the new images to the ECR registry.
    *   Invokes AWS SSM Run Command.
3.  **Deployment (SSM):**
    *   SSM executes a shell script (`deploy.sh`) on the target EC2 instance.
    *   The script pulls the latest images from ECR.
    *   Docker Compose recreates the containers with the updated images.
    *   Unused images are pruned to conserve disk space.

# Configuration management

Configuration is handled through environment variables and AWS Systems Manager Parameter Store.

*   **Local Development:** Variables are defined in `.env` files.
*   **Production:** Sensitive values (database credentials, API keys) are stored in AWS SSM Parameter Store. The deployment script retrieves these values at runtime and injects them into the container environment.

### Key configuration parameters
*   `CRON_SCHEDULE`: Determines the frequency of article generation.
*   `AI_MODEL_NAME`: Specifies the model used via OpenRouter (e.g., `openai/gpt-oss-20b:free`).
*   `ARTICLE_TOPICS`: A comma-separated list of technical topics used for content generation.