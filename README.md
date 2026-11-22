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
- [1.9.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.9/ping_pong)
- [1.10.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.10/log_output)
- [1.11.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.11/volumes) (also [log_output](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.11/log_output) and [ping_pong](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.11/ping_pong))
- [1.12.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.12/todo_app)
- [1.13.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/1.13/todo_app)

### Chapter 3

- [2.1.](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/2.1/log_output) (also [ping_pong](https://github.com/joanstevene98-hue/KubernetesSubmissions/tree/2.1/ping_pong))

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

### 1.9

The ping-pong app shares the ingress of log output (`log_output/manifests/ingress.yaml`).

```
kubectl apply -f ping_pong/manifests -f log_output/manifests
# open http://localhost:8081/pingpong
```

### 1.10

Log output is split into `log_output/writer` and `log_output/reader`, two containers
in the same pod sharing an `emptyDir` volume.

```
kubectl apply -f log_output/manifests
kubectl logs deployment/log-output-dep -c log-writer
# open http://localhost:8081/status
```

### 1.11

The PersistentVolume and its claim live in `volumes/` since they are not application specific.

```
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
kubectl apply -f volumes -f ping_pong/manifests -f log_output/manifests
# open http://localhost:8081/pingpong a few times, then http://localhost:8081/status
```

### 1.12

The todo app caches an image from Lorem Picsum into a persistent volume for 10 minutes.
`GET /shutdown` crashes the container to test that the cached image survives.

```
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube-todo
kubectl apply -f volumes -f todo_app/manifests
# open http://localhost:8081
```

### 1.13

```
kubectl apply -f todo_app/manifests
# open http://localhost:8081
```

### 2.1

Log output asks ping-pong for the count over HTTP (`GET /pings`), no shared volume anymore.

```
kubectl apply -f ping_pong/manifests -f log_output/manifests
# open http://localhost:8081/pingpong a few times, then http://localhost:8081/status
```
