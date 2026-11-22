# DevOps with Kubernetes — submissions

Images are built by GitHub Actions on every tag and pushed to
`ghcr.io/joanstevene98-hue/<app>:<exercise>`.

## Exercises

### Chapter 2

- [1.1.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.1/log_output)
- [1.2.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.2/todo_app)
- [1.3.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.3/log_output)
- [1.4.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.4/todo_app)
- [1.5.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.5/todo_app)
- [1.6.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.6/todo_app)
- [1.7.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.7/log_output)
- [1.8.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.8/todo_app)

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

### 1.3

```
kubectl apply -f log_output/manifests/deployment.yaml
kubectl logs -f deployment/log-output-dep
```

### 1.4

```
kubectl apply -f todo_app/manifests/deployment.yaml
kubectl logs deployment/todo-app-dep
```

### 1.5

```
kubectl apply -f todo_app/manifests/deployment.yaml
kubectl port-forward deployment/todo-app-dep 3003:3000
# open http://localhost:3003
```

### 1.6

```
kubectl apply -f todo_app/manifests
# open http://localhost:8082
```

### 1.7

```
kubectl apply -f log_output/manifests
# open http://localhost:8081/status
```

### 1.8

```
kubectl delete ingress log-output-ingress
kubectl apply -f todo_app/manifests
# open http://localhost:8081
```
