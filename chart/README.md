# Helm Chart for Xfinity Data Usage

Fetch Xfinity data usage and serve it via an HTTP endpoint, publish it to MQTT
or post it to an URL.

To learn more, visit <https://github.com/zachowj/xfinity-data-usage>.

## Prerequisites

- Kubernetes 1.10+

## Installing the Chart

```console
git clone https://github.com/zachowj/xfinity-data-usage.git
helm install \
  --set config.xfinity.username=USERNAME_HERE \
  --set config.xfinity.password=PASSWORD_HERE \
  xfinity-data-usage xfinity-data-usage/chart
```

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall the `xfinity-data-usage` release:

```console
helm uninstall xfinity-data-usage
```

The command removes all the Kubernetes components associated with the chart and
deletes the release.

## Configuration parameters

The following table lists the configurable parameters of the Xfinity Data Usage
chart and their default values.

| Parameter                          | Description                                                                                                 | Default                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `config.xfinity.username`          | Username for Xfinity.                                                                                       | `""`                                     |
| `config.xfinity.password`          | Password for Xfinity.                                                                                       | `""`                                     |
| `config.xfinity.interval`          | Interval at which to update usage data (in minutes).                                                        | `60`                                     |
| `config.xfinity.pageTimeout`       | Number of seconds until request times out (in seconds).                                                     | `30`                                     |
| `config.http`                      | Enable HTTP endpoints for most recent data.                                                                 | `true`                                   |
| `config.post.url`                  | URL where to post usage data to.                                                                            | `unset`                                  |
| `config.mqtt.host`                 | Address of MQTT server.                                                                                     | `unset`                                  |
| `config.mqtt.port`                 | Port of MQTT server.                                                                                        | `unset`                                  |
| `config.mqtt.username`             | Username for MQTT server.                                                                                   | `unset`                                  |
| `config.mqtt.password`             | Password for MQTT server.                                                                                   | `unset`                                  |
| `config.mqtt.topic`                | Topic to publish usage data to if Home Assistant is not set.                                                | `unset`                                  |
| `config.mqtt.homeassistant.prefix` | Auto discovery prefix topic.                                                                                | `unset`                                  |
| `replicaCount`                     | Number of pod replicas. Only one replica is currently supported.                                            | `1`                                      |
| `image.repository`                 | Repository of the container image.                                                                          | `docker.io/zachowj/xfinity-data-usage`   |
| `image.tag`                        | Tag of the container image.                                                                                 | `latest`                                 |
| `image.pullPolicy`                 | Container image pull policy.                                                                                | `Always`                                 |
| `image.imagePullSecrets`           | Name of image pull secrets to be used by kubernetes.                                                        | `[]`                                     |
| `nameOverride`                     | Overrides the name of the chart.                                                                            | `""`                                     |
| `fullnameOverride`                 | Overrides the full name of the chart.                                                                       | `""`                                     |
| `service.type`                     | Service type.                                                                                               | `NodePort`                               |
| `service.port`                     | Incoming port to access Xfinity Data Usage.                                                                 | `7878`                                   |
| `ingress.enabled`                  | Enable ingress.                                                                                             | `true`                                   |
| `ingress.className`                | Ingress className.                                                                                          | `""`                                     |
| `ingress.annotations`              | Ingress annotations.                                                                                        | `{}`                                     |
| `ingress.hosts`                    | Ingress hosts.                                                                                              | `[]`                                     |
| `ingress.tls`                      | Ingress TLS configuration.                                                                                  | `[]`                                     |
| `resources`                        | CPU/memory resource requests/limits.                                                                        | `{}`                                     |
| `nodeSelector`                     | Node labels for pod assignment.                                                                             | `{}`                                     |
| `tolerations`                      | Toleration labels for pod assignment.                                                                       | `[]`                                     |
| `affinity`                         | Affinity settings for pod assignment.                                                                       | `{}`                                     |
| `podSecurityContext`               | Set SecurityContext on the pod level.                                                                       | `{}`                                     |
| `podAnnotations`                   | Set annotations on the pod level.                                                                           | `{}`                                     |
| `podLabels`                        | Set labels on the pod level.                                                                                | `{}`                                     |
| `securityContext`                  | Set the securityContext for the pod.                                                                        | `{}`                                     |
| `volumes`                          | Additional volumes available to containers.                                                                 | `[]`                                     |
| `volumeMounts`                     | Additional mount points of volumes in a container.                                                          | `[]`                                     |

Specify each parameter using the `--set key=value` argument to `helm install`.
For example,

```console
helm install \
  --set config.xfinity.username=USERNAME_HERE \
  --set config.xfinity.password=PASSWORD_HERE \
  xfinity-data-usage xfinity-data-usage/chart
```

Alternatively, a YAML file that specifies the values for the parameters can be
provided while installing the chart. For example,

```console
helm install -f values.yaml xfinity-data-usage xfinity-data-usage/chart
```

> **Tip**: You can use the default [values.yaml](values.yaml)
