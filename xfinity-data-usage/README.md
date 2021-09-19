# Xfinity Data Usage

Fetch Xfinity data usage and serve it via an HTTP endpoint, publish it to MQTT or post it to an URL.

## Getting Started

1. Create a `config.yml` file in the `/config/xfinity-data-usage/` directory
1. Follow the configuration instructions in the main [README.md](https://github.com/zachowj/xfinity-data-usage#configuaration)
    1. In addition to configuring your Xfinity account, be sure to setup either HTTP, MQTT, or a URL to POST to
    1. If you're using an HTTP sensor, configure an egress port on the add-on's configuration page
1. Start the add-on