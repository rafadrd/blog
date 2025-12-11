# Prerequisites

*   AWS Account with administrative access.
*   AWS CLI installed and configured locally.
*   Docker and Docker Compose installed locally for testing.
*   Git repository hosting the project code.

# Infrastructure setup

### 1. Elastic Container Registry (ECR)

Create two repositories in the target AWS region to store the Docker images.

```bash
aws ecr create-repository --repository-name blog-backend
aws ecr create-repository --repository-name blog-frontend
```

### 2. Systems Manager (SSM) Parameter Store

The deployment script retrieves configuration and secrets from the SSM Parameter Store. Create the following SecureString parameters under the `/blog/prod/` path:

*   `/blog/prod/DB_USER`: Database username (e.g., `postgres`).
*   `/blog/prod/DB_PASSWORD`: Database password.
*   `/blog/prod/DB_NAME`: Database name (e.g., `blog_db`).
*   `/blog/prod/OPENROUTER_API_KEY`: API key for the AI service.

### 3. IAM roles

Two IAM roles are required for the pipeline to function.

**EC2 Instance Role**
Attach this role to the EC2 instance. It requires permissions to pull images from ECR and read parameters from SSM.
*   `AmazonEC2ContainerRegistryReadOnly`
*   `AmazonSSMManagedInstanceCore`
*   `AmazonSSMReadOnlyAccess`

**CodeBuild Service Role**
Attach this role to the CodeBuild project. It requires permissions to push images to ECR and trigger commands on the EC2 instance.
*   `AmazonEC2ContainerRegistryPowerUser`
*   `AmazonSSMFullAccess`

### 4. EC2 instance

Launch a `t3.micro` instance with Amazon Linux 2023.

1.  **Network:** Ensure the Security Group allows inbound traffic on port 80 (HTTP) and 22 (SSH).
2.  **IAM Role:** Attach the EC2 Instance Role created in step 3.
3.  **Tags:** Add the tag `Name` with the value `blog-instance`. The deployment script uses this tag to identify the target server.
4.  **User Data:** Use the script located at `infra/scripts/init-ec2.sh` to install Docker and Docker Compose upon initialization.

### 5. CodeBuild project

Create a build project in AWS CodeBuild.

1.  **Source:** Connect to the GitHub repository containing the application code.
2.  **Environment:** Use a managed image (Ubuntu/Standard). Enable the "Privileged" flag to allow building Docker images.
3.  **Service Role:** Attach the CodeBuild Service Role created in step 3.
4.  **Buildspec:** Select "Use a buildspec file" and specify `infra/buildspec.yml`.
5.  **Environment Variables:** Add the following plaintext environment variables:
    *   `AWS_ACCOUNT_ID`: Your 12-digit AWS account ID.
    *   `AWS_DEFAULT_REGION`: The target AWS region (e.g., `eu-north-1`).

# Deployment pipeline

The deployment process follows these steps defined in `infra/buildspec.yml`:

1.  **Pre-build:** Logs into ECR using the CodeBuild environment credentials.
2.  **Build:**
    *   Builds the backend image from `backend/Dockerfile`.
    *   Builds the frontend image from `frontend/Dockerfile`.
3.  **Post-build:**
    *   Pushes both images to the ECR registry with the `latest` tag.
    *   Triggers the `AWS-RunShellScript` document via SSM.
    *   Target: Instances tagged `Name: blog-instance`.
    *   Command: Executes `/home/ec2-user/app/deploy.sh` on the server.

# Server-side deployment script

The script `infra/scripts/deploy.sh` runs on the EC2 instance during deployment. It performs the following operations:

1.  Retrieves environment variables and secrets from SSM Parameter Store.
2.  Logs into ECR.
3.  Pulls the latest `docker-compose.prod.yml` configuration.
4.  Executes `docker compose pull` and `docker compose up -d`.
5.  Prunes unused Docker images to manage disk space.

# Local development

To run the application locally without AWS dependencies:

1.  Navigate to the `infra` directory.
2.  Create a `.env` file based on `backend/.env.example`.
3.  Run the development compose file:

```bash
docker compose -f docker-compose.dev.yml up --build
```

The application will be available at:
*   Frontend: `http://localhost:80`
*   Backend: `http://localhost:3000`
*   Database: Port 5432