#!/bin/bash
GECKODRIVER_VERSION=$(curl https://github.com/mozilla/geckodriver/releases/latest | grep -Po 'v[0-9]+.[0-9]+.[0-9]+')
arch=$(uname -m)
if [[ $arch == x86_64* ]]; then
    arch="linux64"
elif [[ $arch == i*86 ]]; then
    arch="linux32"
else
    echo arch not supported: $arch
    exit 1
fi

if [[ $arch == linux* ]]; then
    URL="https://github.com/mozilla/geckodriver/releases/download/$GECKODRIVER_VERSION/geckodriver-$GECKODRIVER_VERSION-$arch.tar.gz"
    curl -s -L "$URL" | tar -xz
    chmod +x geckodriver
    mv geckodriver /tmp
else
    apt-get -y install gcc-arm-linux-gnueabihf libc6-armhf-cross libc6-dev-armhf-cross
    curl https://sh.rustup.rs -sSf | sh -s -- -y
    source $HOME/.cargo/env
    rustup target install armv7-unknown-linux-gnueabihf

cat >>~/.cargo/config <<EOF
[target.armv7-unknown-linux-gnueabihf]
linker = "arm-linux-gnueabihf-gcc"
EOF

    export PATH="$PATH:$HOME/.cargo/bin"
    cd $HOME
    URL="https://github.com/mozilla/geckodriver/archive/$GECKODRIVER_VERSION.tar.gz"
    curl -s -L "$URL" | tar -xz
    cd geckodriver-${GECKODRIVER_VERSION#?}
    cargo build --release --target armv7-unknown-linux-gnueabihf
    find . -name geckodriver -print0 | xargs -0 -I {} mv {} /tmp
    chmod +x /tmp/geckodriver
fi
