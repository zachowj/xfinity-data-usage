[![Release Version][release-shield]][release-link] [![Docker Pulls][docker-pulls]][docker-link] [![License][license-shield]](LICENSE.md)

[![BuyMeCoffee][buymecoffee-shield]][buymecoffee-link]

# Xfinity Data Usage

Fetch Xfinity data usage and serve it via an HTTP endpoint, publish it to MQTT or post it to an URL.

## Getting Started

### Configuaration

`config.yml` located in the `/config` directory

**xfinity**

Xfinity Account credentials are required.

| Option      |            | Description                                                         |
| ----------- | ---------- | ------------------------------------------------------------------- |
| username    | _required_ | Username for Xfinity                                                |
| password    | _required_ | Password for Xfinity                                                |
| interval    |            | The interval at which to update usage data. Defaults to 60 seconds. |
| pageTimeout |            | Number of seconds until request times out. Defaults to 30 seconds   |

**http** _(optional)_

Enable HTTP endpoints for most recent data. Defaults to port 7878.

Raw data at `http://ipaddress:7878`

Home Assistant rest sensor at `http://ipaddress:7878/homeassistant`

**post** _(optional)_

Enable posting of data after an update to the provided URL.

| Option |            | Description                     |
| ------ | ---------- | ------------------------------- |
| url    | _required_ | URL where to post usage data to |

**mqtt** _(optional)_

| Option               |            | Description                                                 |
| -------------------- | ---------- | ----------------------------------------------------------- |
| host                 | _required_ | Address of MQTT server                                      |
| port                 |            | Port of MQTT server defaults to `1883`                      |
| username             |            | Username for MQTT server                                    |
| password             |            | Password for MQTT server                                    |
| topic                | _required_ | Topic to publish usage data to if Home Assistant is not set |
| homeassistant        |            | When set will publish to auto-discovery topics              |
| homeassistant.prefix |            | Auto discovery prefix topic. Defaults to `homeassistant`    |

**imap** _(optional)_

When defined will attempt to reset your Xfinity password when necessary.

| Option    |            | Description                           |
| --------- | ---------- | ------------------------------------- |
| host      | _required_ | Address of IMAP server server         |
| port      |            | Port of IMAP server defaults to `993` |
| auth.user | _required_ | Username for IMAP server              |
| auth.pass | _required_ | Password for IMAP server              |

Complete config

```yaml
xfinity:
  username: USERNAME
  password: PASSWORD
  interval: 60

http:

post:
  url: http://localhost:1880/xfinity

mqtt:
  host: localhost
  port: 1883
  username: USERNAME
  password: PASSWORD
  topic: xfinity
  homeassistant:
    prefix: "homeassistant"

imap:
  host: "imap.gmail.com"
  auth:
    user: "xxxx@gmail.com"
    pass: "longpasscode"
```

#### docker-compose

```
version: '3.7'

services:
  xfinity:
    image: zachowj/xfinity-data-usage:latest
    container_name: xfinity
    restart: unless-stopped
    ports:
      - 7878:7878
    volumes:
      - config:/config
    environment:
      TZ: America/Los_Angeles
```

#### Volumes

- `/config` - Directory for the config file

## Find Us

- [GitHub](https://github.com/zachowj/xfinity-data-usage)
- [Docker](https://hub.docker.com/r/zachowj/xfinity-data-usage)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the
[tags on this repository](https://github.com/zachowj/xfinity-data-usage/tags).

## Authors

- [zachowj](https://github.com/zachowj) - _Initial work_

See also the list of [contributors](https://github.com/zachowj/xfinity-data-usage/contributors) who
participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

[license-shield]: https://img.shields.io/github/license/zachowj/xfinity-data-usage.svg?style=for-the-badge
[release-link]: https://github.com/zachowj/xfinity-data-usage/releases
[release-shield]: https://img.shields.io/github/v/release/zachowj/xfinity-data-usage?style=for-the-badge
[docker-pulls]: https://img.shields.io/docker/pulls/zachowj/xfinity-data-usage?style=for-the-badge
[docker-link]: https://hub.docker.com/r/zachowj/xfinity-data-usage
[buymecoffee-link]: https://www.buymeacoffee.com/zachowj
[buymecoffee-shield]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png
