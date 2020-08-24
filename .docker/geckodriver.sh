#!/bin/bash    
GECKODRIVER_VERSION=$(curl https://github.com/mozilla/geckodriver/releases/latest | grep -Po 'v[0-9]+.[0-9]+.[0-9]+')
arch=$(uname -m)
if [[ $arch == x86_64* ]]; then
    arch="linux64"    
elif [[ $arch == i*86 ]]; then
    arch="linux32"
elif  [[ $arch == arm* ]]; then
    GECKODRIVER_VERSION="v0.23.0"
    arch="arm7hf"
else
    echo arch not supported: $arch
    exit 1
fi

URL="https://github.com/mozilla/geckodriver/releases/download/$GECKODRIVER_VERSION/geckodriver-$GECKODRIVER_VERSION-$arch.tar.gz"

curl -s -L "$URL" | tar -xz
chmod +x geckodriver
mv geckodriver /tmp
