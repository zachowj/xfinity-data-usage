#!/bin/bash
arch=$(uname -m)
if [[ $arch == x86_64* ]]; then
    GECKODRIVER_VERSION=$(curl https://github.com/mozilla/geckodriver/releases/latest | grep -Po 'v[0-9]+.[0-9]+.[0-9]+')
    URL="https://github.com/mozilla/geckodriver/releases/download/$GECKODRIVER_VERSION/geckodriver-$GECKODRIVER_VERSION-linux64.tar.gz"
    curl -s -L "$URL" | tar -xz
    chmod +x geckodriver
    mv geckodriver /tmp
elif  [[ $arch == armv7* ]]; then
    # https://firefox-source-docs.mozilla.org/testing/geckodriver/ARM.html
    sudo apt install -y gcc-arm-linux-gnueabihf libc6-armhf-cross libc6-dev-armhf-cross
    git clone --depth=1 https://github.com/mozilla/gecko-dev
    curl https://sh.rustup.rs -sSf | bash -s -- -v -y
    declare -a bindirs=("$HOME/.cargo/bin")
    if [[ "$(cat $HOME/.bashrc | grep -P "^PATH=" )" == "" ]]; then
    echo -e "PATH=\$PATH\n" >> $HOME/.bashrc
    fi
    for binfolder in "${bindirs[@]}"
    do
    if [[ "$(cat $HOME/.bashrc | grep -P "^PATH=" | grep "${binfolder}:")" == "" ]]; then
        sed -i -e "s/^PATH=\"\(.*\)\"/PATH=\"$(echo "$binfolder" | sed "s/\//\\\\\//g"):\1\"/g" $HOME/.bashrc # place with no spaces in it
        export PATH="$PATH:$binfolder"
    fi
    done
    source $HOME/.bashrc
    rustup target install armv7-unknown-linux-gnueabihf
    echo -e "[target.armv7-unknown-linux-gnueabihf]
    linker = \"arm-linux-gnueabihf-gcc\"" > "$HOME/gecko-dev/testing/geckodriver/.cargo/config"
    cd "$HOME/gecko-dev/testing/geckodriver"
    cargo build --release --target armv7-unknown-linux-gnueabihf
    # test binary file with this command
    $HOME/gecko-dev/target/armv7-unknown-linux-gnueabihf/release/geckodriver --version
else
    echo arch not supported: $arch
    exit 1
fi
