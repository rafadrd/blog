# System overview

The application consists of three primary services:

*   **Frontend:** A React single-page application served via Nginx.
*   **Backend:** A Node.js/Express API that manages data retrieval and schedules content generation.
*   **Database:** A PostgreSQL instance for persistent storage.

Detailed architectural documentation is available in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

# Prerequisites

*   Docker Engine and Docker Compose
*   Node.js 20+ (for local non-Docker development)
*   An OpenRouter API key (for content generation)

# Local development

The project includes a Docker Compose configuration for local development environments.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Configure environment variables:**
    Create a `.env` file in the `backend` directory based on `backend/.env.example`.
    ```bash
    cp backend/.env.example backend/.env
    ```
    Update the `OPENROUTER_API_KEY` in `backend/.env` with a valid key.

3.  **Start the application:**
    Run the development compose file located in the `infra` directory.
    ```bash
    docker compose -f infra/docker-compose.dev.yml up --build
    ```

4.  **Access the application:**
    *   Frontend: `http://localhost:80`
    *   Backend API: `http://localhost:3000`
    *   Database: Port `5432`

# Deployment

The production infrastructure is defined for Amazon Web Services (AWS). The deployment pipeline utilizes AWS CodeBuild, Amazon ECR, and AWS Systems Manager (SSM).

### Infrastructure components

*   **EC2:** Hosts the application containers.
*   **ECR:** Stores Docker images for the frontend and backend.
*   **CodeBuild:** Builds images and pushes them to ECR upon repository changes.
*   **SSM Parameter Store:** Manages production configuration secrets.

### Deployment workflow

1.  **Build:** CodeBuild triggers on source changes, builds the Docker images using `infra/buildspec.yml`, and pushes them to ECR.
2.  **Trigger:** The build process executes an AWS SSM command targeting the EC2 instance.
3.  **Update:** The EC2 instance executes `infra/scripts/deploy.sh`, which pulls the new images and restarts the containers using `infra/docker-compose.prod.yml`.

# Directory structure

```text
.
├── backend/                    # Node.js API service
│   ├── src/
│   │   ├── config/             # Environment and app configuration
│   │   ├── db/                 # Database connection and schema
│   │   ├── repositories/       # Data access layer
│   │   ├── routes/             # API route definitions
│   │   └── services/           # Business logic (AI client, scheduler)
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── api/                # HTTP client
│   │   ├── components/         # UI components
│   │   ├── hooks/              # Custom React hooks
│   │   └── pages/              # Route views
│   ├── Dockerfile
│   ├── nginx.conf              # Nginx reverse proxy config
│   └── package.json
│
├── infra/                      # Infrastructure configuration
│   ├── scripts/                # Deployment and init scripts
│   ├── buildspec.yml           # AWS CodeBuild specification
│   ├── docker-compose.dev.yml  # Local development config
│   └── docker-compose.prod.yml # Production config
│
└── docs/                       # Documentation
    └── ARCHITECTURE.md
```