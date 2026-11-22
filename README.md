# DevOps with Kubernetes — submissions

Images are built by GitHub Actions on every tag and pushed to
`ghcr.io/joanstevene98-hue/<app>:<exercise>`.

## Exercises

### Chapter 2

- [1.1.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.1/log_output)
- [1.2.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.2/todo_app)

## Running

```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

### 1.1

```
kubectl create deployment log-output --image=ghcr.io/joanstevene98-hue/log-output:1.1
kubectl logs -f deployment/log-output
```

### 1.2

```
kubectl create deployment todo-app --image=ghcr.io/joanstevene98-hue/todo-app:1.2
kubectl logs deployment/todo-app
```
