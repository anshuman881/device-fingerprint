# WebFingerprint Docker & Kubernetes Deployment Guide

This guide explains how to build a Docker image for the WebFingerprint Spring Boot application and deploy it to Kubernetes (Docker Desktop).

## Prerequisites

- Docker Desktop installed and running
- Kubernetes enabled in Docker Desktop (Settings → Kubernetes → Enable Kubernetes)
- kubectl configured to use Docker Desktop context
- Java 24+ (for local builds)
- Maven (for local builds)

## Project Structure

```
webfingerprint/
├── Dockerfile              # Multi-stage Docker build file
├── .dockerignore           # Files to exclude from Docker build
├── k8s/
│   ├── deployment.yaml     # Kubernetes Deployment
│   ├── service.yaml        # Kubernetes Service (LoadBalancer + ClusterIP)
│   └── configmap.yaml      # Kubernetes ConfigMap for configuration
└── src/                    # Application source code
```

## Step 1: Build the Docker Image

### Option A: Build using Docker CLI

```bash
# Navigate to the webfingerprint directory
cd webfingerprint

# Build the Docker image
docker build -t webfingerprint:latest .

# Verify the image was created
docker images | grep webfingerprint
```

### Option B: Build using Maven Spring Boot Plugin

```bash
# Build using Spring Boot's build-image goal
./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=webfingerprint:latest
```

## Step 2: Test the Docker Image Locally

```bash
# Run the container locally to test
docker run -d --name webfingerprint-test -p 8080:8080 webfingerprint:latest

# Check if the container is running
docker ps

# Check the logs
docker logs webfingerprint-test

# Test the application
curl http://localhost:8080/actuator/health

# Stop and remove the test container
docker stop webfingerprint-test
docker rm webfingerprint-test
```

## Step 3: Deploy to Kubernetes (Docker Desktop)

### 3.1 Verify Kubernetes is Running

```bash
# Check Kubernetes cluster status
kubectl cluster-info

# Verify nodes are ready
kubectl get nodes
```

### 3.2 Create a Namespace (Optional but Recommended)

```bash
# Create a namespace for the application
kubectl create namespace webfingerprint

# Set the namespace as default for current context
kubectl config set-context --current --namespace=webfingerprint
```

### 3.3 Deploy the Application

```bash
# Navigate to k8s directory or use relative paths
cd webfingerprint

# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Or apply individually:
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### 3.4 Verify the Deployment

```bash
# Check deployment status
kubectl get deployments

# Check pods
kubectl get pods

# Check services
kubectl get services

# Check all resources
kubectl get all -l app=webfingerprint
```

### 3.5 Check Pod Logs

```bash
# Get the pod name
kubectl get pods -l app=webfingerprint

# View logs
kubectl logs -l app=webfingerprint -f

# View logs for a specific pod
kubectl logs <pod-name> -f
```

## Step 4: Access the Application

### Option A: Using LoadBalancer Service

```bash
# Get the external IP/URL
kubectl get service webfingerprint

# The application will be available at:
# http://localhost (port 80)
```

### Option B: Using Port Forwarding

```bash
# Port forward to access locally
kubectl port-forward service/webfingerprint-internal 8080:8080

# Access the application at:
# http://localhost:8080
```

## Step 5: Test the Application

```bash
# Health check
curl http://localhost:8080/actuator/health

# API documentation (Swagger UI)
# Open in browser: http://localhost:8080/swagger-ui.html

# H2 Console (for development)
# Open in browser: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:file:/app/data/devicetracker
# Username: sa
# Password: (empty)
```

## Useful Kubernetes Commands

### Scaling the Application

```bash
# Scale up to 3 replicas
kubectl scale deployment webfingerprint --replicas=3

# Check the scaling
kubectl get pods -l app=webfingerprint
```

### Rolling Updates

```bash
# After building a new image version
docker build -t webfingerprint:v2 .

# Update the deployment
kubectl set image deployment/webfingerprint webfingerprint=webfingerprint:v2

# Check rollout status
kubectl rollout status deployment/webfingerprint

# View rollout history
kubectl rollout history deployment/webfingerprint

# Rollback if needed
kubectl rollout undo deployment/webfingerprint
```

### Debugging

```bash
# Describe a pod for detailed info
kubectl describe pod <pod-name>

# Execute a shell inside the container
kubectl exec -it <pod-name> -- /bin/sh

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods
```

### Cleanup

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete individually
kubectl delete deployment webfingerprint
kubectl delete service webfingerprint webfingerprint-internal
kubectl delete configmap webfingerprint-config

# Delete namespace (if created)
kubectl delete namespace webfingerprint
```

## Configuration

### Environment Variables

The application can be configured using environment variables. See `k8s/configmap.yaml` for available options.

### Resource Limits

Default resource configuration in `k8s/deployment.yaml`:
- **Requests**: 256Mi memory, 250m CPU
- **Limits**: 512Mi memory, 500m CPU

Adjust these values based on your application needs.

### Persistent Storage (Production)

For production deployments, consider using PersistentVolumes for data persistence:

```yaml
# Add to deployment.yaml volumes section
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: webfingerprint-pvc
```

## Troubleshooting

### Image Pull Errors

If you see `ImagePullBackOff` errors:

```bash
# Ensure the image exists locally
docker images | grep webfingerprint

# For Docker Desktop, images should be available automatically
# For other clusters, you may need to push to a registry
```

### Pod Not Starting

```bash
# Check pod events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Check if the pod is pending due to resource constraints
kubectl describe pod <pod-name> | grep -A 5 Events
```

### Health Check Failures

```bash
# Check if the application started correctly
kubectl logs <pod-name> | grep -i "started\|error\|exception"

# Check actuator health endpoint
kubectl exec <pod-name> -- wget -qO- http://localhost:8080/actuator/health
```

## Production Considerations

1. **Use a real database** instead of H2 (PostgreSQL, MySQL, etc.)
2. **Add PersistentVolumes** for data persistence
3. **Configure proper resource limits** based on load testing
4. **Enable HTTPS** with TLS certificates
5. **Add network policies** for security
6. **Configure log aggregation** (ELK, Loki, etc.)
7. **Set up monitoring** with Prometheus and Grafana
8. **Configure horizontal pod autoscaling** for automatic scaling

## Quick Reference Commands

```bash
# Build
docker build -t webfingerprint:latest .

# Deploy
kubectl apply -f k8s/

# Check status
kubectl get all -l app=webfingerprint

# View logs
kubectl logs -l app=webfingerprint -f

# Port forward
kubectl port-forward service/webfingerprint-internal 8080:8080

# Cleanup
kubectl delete -f k8s/
```
