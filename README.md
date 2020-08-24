[![Release Version][release-shield]][release-link] [![Docker Pulls][docker-pulls]][docker-link] [![License][license-shield]](LICENSE.md)

[![BuyMeCoffee][buymecoffee-shield]][buymecoffee-link]

# Xfinity Data Usage

Fetch Xfinity usage data and serve it via an HTTP endpoint or post it to an URL.

## Getting Started

### Configuaration

`config.yml` located in the `/config` directory

**xfinity**

Xfinity Account credentials are required.

| Option   |            | Description                                                         |
| -------- | ---------- | ------------------------------------------------------------------- |
| user     | _required_ |                                                                     |
| password | _required_ |                                                                     |
| interval |            | The interval at which to update usage data. Defaults to 60 seconds. |

**http**
Enable HTTP endpoint for most recent data. Port 7878

**post**

Will post data after an update to the provided URL.

| Option |            | Description                     |
| ------ | ---------- | ------------------------------- |
| url    | _required_ | URL where to post usage data to |

Complete config

```yaml
xfinity:
    user: USERNAME
    password: PASSWORD
    interval: 60

http:

post:
    url: http://localhost:1880/xfinity
```

#### docker 

```shell
docker run -v config:/config zachowj:xfinity-data-usage
```

#### docker-compose

```
version: '3.7'

services:
  xfinity:
    image: zachowj/xfinity-data-usage:latest
    restart: always
    ports:
      - 7878:7878
    volumes:
      - config:/config
```

#### Volumes

-   `/config` - Directory for the config file

## Find Us

-   [GitHub](https://github.com/zachowj/xfinity-data-usage)
-   [Docker](https://hub.docker.com/repository/docker/zachowj/xfinity-data-usage)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the
[tags on this repository](https://github.com/zachowj/xfinity-data-usage/tags).

## Authors

-   **Jason Zachow** - _Initial work_ - [zachowj](https://github.com/zachowj)

See also the list of [contributors](https://github.com/zachowj/xfinity-data-usage/contributors) who
participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

[license-shield]: https://img.shields.io/github/license/zachowj/xfinity-data-usage.svg?style=for-the-badge
[release-link]: https://github.com/zachowj/xfinity-data-usage/releases
[release-shield]: https://img.shields.io/github/v/release/zachowj/xfinity-data-usage?style=for-the-badge
[docker-pulls]: https://img.shields.io/docker/pulls/zachowj/xfinity-data-usage?style=for-the-badge
[docker-link]: https://hub.docker.com/repository/docker/zachowj/xfinity-data-usage
[buymecoffee-link]: https://www.buymeacoffee.com/zachowj
[buymecoffee-shield]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png
