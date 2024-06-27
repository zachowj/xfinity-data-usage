# Changelog

## What's Changed
* chore(deps): bump puppeteer-core from 18.2.1 to 19.0.0 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/66
* chore(deps): bump docker/setup-buildx-action from 1 to 2 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/73
* chore(deps): bump GoogleCloudPlatform/release-please-action from 2.4.2 to 3.5.0 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/72
* chore(deps): bump docker/setup-qemu-action from 1 to 2 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/71
* chore(deps): bump crazy-max/ghaction-docker-login from 1 to 2 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/70
* chore(deps): bump peter-evans/dockerhub-description from 2 to 3 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/69
* chore(deps): bump actions/checkout from 2 to 3 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/75
* chore(deps): bump GoogleCloudPlatform/release-please-action from 3.5.0 to 3.5.1 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/76
* chore(deps-dev): bump @types/puppeteer-core from 5.4.0 to 7.0.4 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/78
* chore(deps): bump GoogleCloudPlatform/release-please-action from 3.5.1 to 3.6.0 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/79


**Full Changelog**: https://github.com/zachowj/xfinity-data-usage/compare/v0.17.2...v0.17.3

## What's Changed
* chore(deps): bump GoogleCloudPlatform/release-please-action from 3.6.0 to 3.6.1 by @dependabot in https://github.com/zachowj/xfinity-data-usage/pull/81


**Full Changelog**: https://github.com/zachowj/xfinity-data-usage/compare/v0.17.3...v0.17.4

## [0.24.1](https://github.com/zachowj/xfinity-data-usage/compare/v0.24.0...v0.24.1) (2024-06-27)


### Bug Fixes

* Add missing awaits ([bebf4ae](https://github.com/zachowj/xfinity-data-usage/commit/bebf4ae0e97b714591fd091d37966af81e2e6279))

## [0.24.0](https://github.com/zachowj/xfinity-data-usage/compare/v0.23.0...v0.24.0) (2024-06-26)


### Features

* Reset cookies on failed fetch ([c192a54](https://github.com/zachowj/xfinity-data-usage/commit/c192a5487f7417764a78d0570fe221b46d07d83c))


### Bug Fixes

* Catch error from waitForLoadState ([ce7b027](https://github.com/zachowj/xfinity-data-usage/commit/ce7b027bf83972f577d0cd6aeabab616b5f26eed))


### Performance Improvements

* Use node:22-bookworm-slim for base image ([9d484a5](https://github.com/zachowj/xfinity-data-usage/commit/9d484a53430bc7e0d54e5c6a6ddaf8db60026cd8))

## [0.23.0](https://github.com/zachowj/xfinity-data-usage/compare/v0.22.0...v0.23.0) (2024-06-24)


### ⚠ BREAKING CHANGES

* Remove arm7 builld because the playwright base image doesn't support it

### Build System

* Remove arm7 builld because the playwright base image doesn't support it ([a537657](https://github.com/zachowj/xfinity-data-usage/commit/a537657bd27c7c9703052a1c2a674ef90e1b819a))

## [0.22.0](https://github.com/zachowj/xfinity-data-usage/compare/v0.21.0...v0.22.0) (2024-06-24)


### Features

* Switch headless browser to firefox ([517a847](https://github.com/zachowj/xfinity-data-usage/commit/517a847b3ceaf7da1c663509e4a1ccbdc68f362c))


### Bug Fixes

* Fix codename in dockerfile ([3fb1307](https://github.com/zachowj/xfinity-data-usage/commit/3fb130707622ce9ce848fc7c922eb598e0ea6cee))

## [0.21.0](https://github.com/zachowj/xfinity-data-usage/compare/v0.20.2...v0.21.0) (2023-12-18)


### Features

* Add reading/writing cookies back in ([0c97629](https://github.com/zachowj/xfinity-data-usage/commit/0c97629d98f19991e60244b244b377055dcd2319))

## [0.20.2](https://github.com/zachowj/xfinity-data-usage/compare/v0.2.1...v0.20.2) (2023-07-23)


### Features

* Add check for confirmation element after reseting password ([a6b8ee0](https://github.com/zachowj/xfinity-data-usage/commit/a6b8ee0565358c8c715b5d211a246490375f3b31))
* Add configurable pageTimeout for puppeteer ([c019e17](https://github.com/zachowj/xfinity-data-usage/commit/c019e173db98713eb5d89f110e34e95aa22d9040))
* add dumb-init ([679d2ba](https://github.com/zachowj/xfinity-data-usage/commit/679d2ba596394b7e138325de08ac02d7c37b1719))
* Add imap option to automatically reset xfinity password ([1d347a4](https://github.com/zachowj/xfinity-data-usage/commit/1d347a4f3437be853bad17e58b5f3a49e5a3e076))
* Add incremental suffix to password when resetting ([b6009cf](https://github.com/zachowj/xfinity-data-usage/commit/b6009cf9e6b15e1db26c73dc204c079b0adaddc4))
* Add limit to retry logging in ([add3105](https://github.com/zachowj/xfinity-data-usage/commit/add3105d41e7a01ffa1e3a4866ef3e2b1569b00d))
* Add logging levels ([4bb38f7](https://github.com/zachowj/xfinity-data-usage/commit/4bb38f7c1e2572b6cf131376208d1568f58fa857))
* Add reading/writing cookies back in ([b07f6ee](https://github.com/zachowj/xfinity-data-usage/commit/b07f6ee88c2d49a2c3a05bc55e77dbdbfa8ea9d8))
* Add security check bypass ([12e3c49](https://github.com/zachowj/xfinity-data-usage/commit/12e3c4941f814aa3c2642909506193a99eeed0cc))
* Configurable config folder ([#46](https://github.com/zachowj/xfinity-data-usage/issues/46)) ([736e8de](https://github.com/zachowj/xfinity-data-usage/commit/736e8de2a781c8a6162b5d506f1b7dfd0b33be86))
* Maintain Xfinity account session (less password resets) ([#39](https://github.com/zachowj/xfinity-data-usage/issues/39)) ([ffaac34](https://github.com/zachowj/xfinity-data-usage/commit/ffaac348de25c28f7fffbd3a7d0f5a5924c8d437))
* Reject requests for images, fonts and domains not *xfinity.com ([a3d2091](https://github.com/zachowj/xfinity-data-usage/commit/a3d20915177c39b7a965c2dbaec45d1e5185bc6f))
* Replace geckodriver and selenium with chromium and puppeteer ([22bd274](https://github.com/zachowj/xfinity-data-usage/commit/22bd2745c35a1655ae9bcc1eead20886c617e354))
* run buster-slim as the final build image ([f0adc4a](https://github.com/zachowj/xfinity-data-usage/commit/f0adc4a4ab99f32bedbab3fa5ffd9212f1131fee))
* Spawn xfinity as a child process ([8503b44](https://github.com/zachowj/xfinity-data-usage/commit/8503b445dfbc6b1bad7d664a81cd0031561759a7))
* switch to alpine for the final build ([ce2098b](https://github.com/zachowj/xfinity-data-usage/commit/ce2098b14f8fcaf35516931567598d0b8b737fd7))
* Update to node 16 ([b210c51](https://github.com/zachowj/xfinity-data-usage/commit/b210c51cd33f53ac1e520251ff74ad937ac76750))
* Use a stealth plugin ([e1ce0da](https://github.com/zachowj/xfinity-data-usage/commit/e1ce0da112968ad92a71f391185694db0802eb04))


### Bug Fixes

* add launch option disable-setuid-sandbox ([0ebfd73](https://github.com/zachowj/xfinity-data-usage/commit/0ebfd73b5395b10f88f170dbd293def7dd87492f))
* Add missing await to startOver ([aff1cb7](https://github.com/zachowj/xfinity-data-usage/commit/aff1cb716058948c98d5b857f26510614457a386)), closes [#108](https://github.com/zachowj/xfinity-data-usage/issues/108)
* Add yarn timeout to dockerfile ([f48a4c8](https://github.com/zachowj/xfinity-data-usage/commit/f48a4c8016de4cd204db50a4b0af97d906c337e7))
* Always close brower session ([7404be4](https://github.com/zachowj/xfinity-data-usage/commit/7404be4bfa0f70c82898eb4ebd8112bffd44f9aa))
* Attempt to fix yarn timeout in docker build ([6364a73](https://github.com/zachowj/xfinity-data-usage/commit/6364a737634d10aeb8b5830789e1ea2a105b30e1))
* **build:** Copy types dir for the docker build ([906100b](https://github.com/zachowj/xfinity-data-usage/commit/906100b0d54d6d78e3f9ba4750dc46fbb907971a))
* catch errors throw from imap ([069e8c9](https://github.com/zachowj/xfinity-data-usage/commit/069e8c9425f65c1d7d36b4573ff8e5e45e2d454c))
* check if page is still valid ([1a2ee00](https://github.com/zachowj/xfinity-data-usage/commit/1a2ee00bd2a92afa9e1f3c0d6d75dec580dca662))
* Clear setTimeout if code is found ([3dd41b7](https://github.com/zachowj/xfinity-data-usage/commit/3dd41b7ce7ce3559b820700233b13027963c3255))
* correct firefox spelling ([6453a78](https://github.com/zachowj/xfinity-data-usage/commit/6453a780ea00596f3e47bd54c5358535a0fa6f7b))
* Don't catch imap connection errors ([4fd7535](https://github.com/zachowj/xfinity-data-usage/commit/4fd753523295bcf50658735f608fd027ddc70ab6))
* Don't commit late at night ([ebdc1b5](https://github.com/zachowj/xfinity-data-usage/commit/ebdc1b50b02b6a7a9df9e38bb4f3ea05b8da9c75))
* Don't wait for the username field as it could be hidden ([ab90889](https://github.com/zachowj/xfinity-data-usage/commit/ab90889985ebdba85f3364db9d97b0481981e447))
* Fix param type cast ([69d39b4](https://github.com/zachowj/xfinity-data-usage/commit/69d39b4b75d100fdfe0b842c94c378a24687aec2))
* Handle first run without password file ([2fa4fc7](https://github.com/zachowj/xfinity-data-usage/commit/2fa4fc7fbeb8173a36e4e8023261757fa76e54c2))
* improved error handling of imap flow ([1e2ae93](https://github.com/zachowj/xfinity-data-usage/commit/1e2ae93a7912f1f98baa230f4097f7466924a9ea))
* mem leak fix? ([3ef267c](https://github.com/zachowj/xfinity-data-usage/commit/3ef267ce18795af262a0588e5111f66a4f132eba))
* Possible fix for [#14](https://github.com/zachowj/xfinity-data-usage/issues/14) ([9c6fa0a](https://github.com/zachowj/xfinity-data-usage/commit/9c6fa0a85e9ab3a09f36a97bacc00b931bdc387c))
* possible fix for imapflow import ([9ea5d4d](https://github.com/zachowj/xfinity-data-usage/commit/9ea5d4d23ec1c32a8f249507377eb1a88c44403c))
* puppeteer types ([106e8db](https://github.com/zachowj/xfinity-data-usage/commit/106e8dbe9db8847771c6af5518fc3083a28f469c))
* remove console.log ([6ce6cee](https://github.com/zachowj/xfinity-data-usage/commit/6ce6cee5dc64f161225fdd1a795203c1b0fdd5b0))
* Remove deleted directory from dockerfile ([67c70fa](https://github.com/zachowj/xfinity-data-usage/commit/67c70fa28d820aa247be6e0fff3a4f55dee77bba))
* Remove URL parsing ([a155ef4](https://github.com/zachowj/xfinity-data-usage/commit/a155ef4b1cb87874056383ba64be70799c0ee6b7)), closes [#30](https://github.com/zachowj/xfinity-data-usage/issues/30)
* Replace Request with axios ([8ebdd90](https://github.com/zachowj/xfinity-data-usage/commit/8ebdd90ffff2c3345525e19476a8709a27184201))
* Send bearer token when fetching data json ([15b5f1e](https://github.com/zachowj/xfinity-data-usage/commit/15b5f1ed63dbb007e1c236563551ad92bab00e19))
* Use correct docker link in README ([15b9cc9](https://github.com/zachowj/xfinity-data-usage/commit/15b9cc961a2a6d490ae8b42456d440c884da5a83))
* use correct package name in action ([10d0c6f](https://github.com/zachowj/xfinity-data-usage/commit/10d0c6f6df96bfadb04905d372974f97afc2a3af))
* wait for page load after security check ([3b29083](https://github.com/zachowj/xfinity-data-usage/commit/3b290831299aa815f1e2140bd9a30ea7d8c24920))
* Wait for pre selector on json page ([af13d95](https://github.com/zachowj/xfinity-data-usage/commit/af13d959191831122d714088153fdd916b6a3482))
* Wait for title element to be loaded before reading it ([8c56aef](https://github.com/zachowj/xfinity-data-usage/commit/8c56aef5270cde464717d6e008ab734fa0108c6a))


### Documentation

* fix imap.auth.pass location in readme ([9475f05](https://github.com/zachowj/xfinity-data-usage/commit/9475f05aa02f73768ec5a4c184b35ce5e6e522d4))
* Update description ([ba06afd](https://github.com/zachowj/xfinity-data-usage/commit/ba06afd4202c325a5c0a862b3bef4345fcbbefe6))
* Update path for imap auth ([8a9a817](https://github.com/zachowj/xfinity-data-usage/commit/8a9a817bc498885751dd733141186bcd4eb13072))
* Update README ([c32d7d4](https://github.com/zachowj/xfinity-data-usage/commit/c32d7d46d35e7f0d83ae77130904973ee79197f3))
* Update README typo ([#55](https://github.com/zachowj/xfinity-data-usage/issues/55)) ([53b2663](https://github.com/zachowj/xfinity-data-usage/commit/53b2663d92781060109f739beae3c87700d979a6))


### Miscellaneous

* Add inspect script and open port in dev docker container ([e1125b6](https://github.com/zachowj/xfinity-data-usage/commit/e1125b6a7e0eccf9d35be7ccd627b0571086cfd4))
* Add log about password reset ([3d85dd6](https://github.com/zachowj/xfinity-data-usage/commit/3d85dd674819b072d350ff34ff52f9154de4d1ae))
* Add missing interfaces ([50e8de3](https://github.com/zachowj/xfinity-data-usage/commit/50e8de3867ed4f37e240adf40fc49a5678516e06))
* Create FUNDING.yml ([ee82b50](https://github.com/zachowj/xfinity-data-usage/commit/ee82b503b83a88dcd1dfffd9ad26d27b254189ab))
* **deps-dev:** bump @types/node from 18.16.19 to 20.4.1 ([#123](https://github.com/zachowj/xfinity-data-usage/issues/123)) ([53b9513](https://github.com/zachowj/xfinity-data-usage/commit/53b951380a6276db951f7b2b6b6f5f5ca27fcdb2))
* **deps-dev:** bump @types/pino from 6.3.12 to 7.0.5 ([#64](https://github.com/zachowj/xfinity-data-usage/issues/64)) ([c87c243](https://github.com/zachowj/xfinity-data-usage/commit/c87c2436775f3e10b6e5de5a2294afb7165538a5))
* **deps-dev:** bump @types/puppeteer-core from 5.4.0 to 7.0.4 ([#78](https://github.com/zachowj/xfinity-data-usage/issues/78)) ([3c08638](https://github.com/zachowj/xfinity-data-usage/commit/3c086385d74e9e0b029af62ea3b4c28e579a1358))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#122](https://github.com/zachowj/xfinity-data-usage/issues/122)) ([b8fbd01](https://github.com/zachowj/xfinity-data-usage/commit/b8fbd0116efb1d3f322e475b3989f9a6331dfffc))
* **deps-dev:** bump @typescript-eslint/parser from 5.62.0 to 6.1.0 ([#125](https://github.com/zachowj/xfinity-data-usage/issues/125)) ([95496b2](https://github.com/zachowj/xfinity-data-usage/commit/95496b2f67c4c98a81f3a644b497ff2e3a6c79ee))
* **deps-dev:** bump eslint from 7.32.0 to 8.23.1 ([#62](https://github.com/zachowj/xfinity-data-usage/issues/62)) ([27290df](https://github.com/zachowj/xfinity-data-usage/commit/27290df2962271e9c921197ba28d39102a80574d))
* **deps-dev:** bump eslint-plugin-n from 15.7.0 to 16.0.1 ([#119](https://github.com/zachowj/xfinity-data-usage/issues/119)) ([6b028e4](https://github.com/zachowj/xfinity-data-usage/commit/6b028e4c2f3557871cfb89c67b950b4ffd8f2a31))
* **deps-dev:** bump eslint-plugin-prettier from 4.2.1 to 5.0.0 ([#126](https://github.com/zachowj/xfinity-data-usage/issues/126)) ([e5d0fb7](https://github.com/zachowj/xfinity-data-usage/commit/e5d0fb7f29c028716ea5e14b80894f966597dda7))
* **deps-dev:** bump eslint-plugin-promise from 5.2.0 to 6.0.1 ([#63](https://github.com/zachowj/xfinity-data-usage/issues/63)) ([3eb851d](https://github.com/zachowj/xfinity-data-usage/commit/3eb851d1e3b65d57fd52cc443894009b38ac0126))
* **deps-dev:** bump eslint-plugin-simple-import-sort ([#61](https://github.com/zachowj/xfinity-data-usage/issues/61)) ([57e6398](https://github.com/zachowj/xfinity-data-usage/commit/57e639872bf19fbc3f0b65853f8133076d724d4c))
* **deps-dev:** bump eslint-plugin-simple-import-sort ([#92](https://github.com/zachowj/xfinity-data-usage/issues/92)) ([ca01301](https://github.com/zachowj/xfinity-data-usage/commit/ca01301f3eac5a1e982c25cc43184c344523e92b))
* **deps-dev:** bump eslint-plugin-simple-import-sort ([#95](https://github.com/zachowj/xfinity-data-usage/issues/95)) ([8457fe1](https://github.com/zachowj/xfinity-data-usage/commit/8457fe1f3f6f60128a1e278a1366a9ac040434ca))
* **deps-dev:** bump prettier from 2.8.8 to 3.0.0 ([#121](https://github.com/zachowj/xfinity-data-usage/issues/121)) ([173231a](https://github.com/zachowj/xfinity-data-usage/commit/173231a8e466c6e39dc65bd4cdee551edea6ed78))
* **deps-dev:** bump typescript from 4.9.5 to 5.0.3 ([#101](https://github.com/zachowj/xfinity-data-usage/issues/101)) ([abdb62c](https://github.com/zachowj/xfinity-data-usage/commit/abdb62cfb39a142d819ac0851295b870f5bcddaa))
* **deps:** bump actions/checkout from 2 to 3 ([#75](https://github.com/zachowj/xfinity-data-usage/issues/75)) ([a72da0a](https://github.com/zachowj/xfinity-data-usage/commit/a72da0a1c2a470b37d8877abf318010aa1b6b8dd))
* **deps:** bump crazy-max/ghaction-docker-login from 1 to 2 ([#70](https://github.com/zachowj/xfinity-data-usage/issues/70)) ([61982bd](https://github.com/zachowj/xfinity-data-usage/commit/61982bdd2dd800c16b4e1035ba03faa56c06094b))
* **deps:** bump docker/setup-buildx-action from 1 to 2 ([#73](https://github.com/zachowj/xfinity-data-usage/issues/73)) ([08ff131](https://github.com/zachowj/xfinity-data-usage/commit/08ff131514d67f879eaa65bda232bc2e70facd2b))
* **deps:** bump docker/setup-qemu-action from 1 to 2 ([#71](https://github.com/zachowj/xfinity-data-usage/issues/71)) ([3d42c88](https://github.com/zachowj/xfinity-data-usage/commit/3d42c889982cf01b6fc35d15335a1e54af2fc992))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#100](https://github.com/zachowj/xfinity-data-usage/issues/100)) ([43b1298](https://github.com/zachowj/xfinity-data-usage/commit/43b12980795e9968b3cefaf39ed1aeafcac3c099))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#103](https://github.com/zachowj/xfinity-data-usage/issues/103)) ([4b51609](https://github.com/zachowj/xfinity-data-usage/commit/4b516094cb246bb302df3d3331c2318ed1d0a36f))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#105](https://github.com/zachowj/xfinity-data-usage/issues/105)) ([7b390b8](https://github.com/zachowj/xfinity-data-usage/commit/7b390b82139fe9e84bfa1cd91686390f0f8f26d1))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#117](https://github.com/zachowj/xfinity-data-usage/issues/117)) ([8ae9407](https://github.com/zachowj/xfinity-data-usage/commit/8ae9407668f04f541814311c16d1fb116551f44d))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#72](https://github.com/zachowj/xfinity-data-usage/issues/72)) ([b083729](https://github.com/zachowj/xfinity-data-usage/commit/b0837292e14368c57222585d7e2ed492f27a54c2))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#76](https://github.com/zachowj/xfinity-data-usage/issues/76)) ([33513f5](https://github.com/zachowj/xfinity-data-usage/commit/33513f5ee8c0e0c8a9f416c81f2c0828d4f1d79f))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#79](https://github.com/zachowj/xfinity-data-usage/issues/79)) ([05bf0e8](https://github.com/zachowj/xfinity-data-usage/commit/05bf0e8dfdc26b222af369dc9480940472d97574))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#81](https://github.com/zachowj/xfinity-data-usage/issues/81)) ([22fa86d](https://github.com/zachowj/xfinity-data-usage/commit/22fa86db8e4a3784ccf9e349f17ce5bf77832e31))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#83](https://github.com/zachowj/xfinity-data-usage/issues/83)) ([e38d3a0](https://github.com/zachowj/xfinity-data-usage/commit/e38d3a0e789b2a5822e81b49dd2a304795f5e5cc))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#91](https://github.com/zachowj/xfinity-data-usage/issues/91)) ([64b360a](https://github.com/zachowj/xfinity-data-usage/commit/64b360a4edc75f8880664afff9a828fe943ef2b8))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#94](https://github.com/zachowj/xfinity-data-usage/issues/94)) ([6e31971](https://github.com/zachowj/xfinity-data-usage/commit/6e31971bf3ab6a0324aa246d56edeaef728162bc))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#97](https://github.com/zachowj/xfinity-data-usage/issues/97)) ([f21f79f](https://github.com/zachowj/xfinity-data-usage/commit/f21f79f279327264c6023f382458ca04ca2cdaf0))
* **deps:** bump peter-evans/dockerhub-description from 2 to 3 ([#69](https://github.com/zachowj/xfinity-data-usage/issues/69)) ([1739359](https://github.com/zachowj/xfinity-data-usage/commit/173935928a97612f590537a98849bc2260ef2f69))
* **deps:** bump puppeteer-core from 10.4.0 to 18.0.5 ([#65](https://github.com/zachowj/xfinity-data-usage/issues/65)) ([21ac4f2](https://github.com/zachowj/xfinity-data-usage/commit/21ac4f225ef7abf51d4c65a217abbe0e8c7922ab))
* **deps:** bump puppeteer-core from 18.2.1 to 19.0.0 ([#66](https://github.com/zachowj/xfinity-data-usage/issues/66)) ([c9fe297](https://github.com/zachowj/xfinity-data-usage/commit/c9fe297b092ea5fd32731d49a0d2d3ef15f98ae0))
* **deps:** Update dependencies ([8ebdd90](https://github.com/zachowj/xfinity-data-usage/commit/8ebdd90ffff2c3345525e19476a8709a27184201))
* force release ([20de8dd](https://github.com/zachowj/xfinity-data-usage/commit/20de8dddcc1833cfa15bb4a950b0da2a477da22b))
* **main:** release 0.17.3 ([#74](https://github.com/zachowj/xfinity-data-usage/issues/74)) ([ed12a1e](https://github.com/zachowj/xfinity-data-usage/commit/ed12a1e033709bd4d1f6a2c19fc701ff665cc9af))
* **main:** release 0.17.4 ([#82](https://github.com/zachowj/xfinity-data-usage/issues/82)) ([61595da](https://github.com/zachowj/xfinity-data-usage/commit/61595daf7afe7f7967f6e1cc6b07a1b32620cc0d))
* **main:** release 0.17.5 ([#85](https://github.com/zachowj/xfinity-data-usage/issues/85)) ([3172e4b](https://github.com/zachowj/xfinity-data-usage/commit/3172e4b0a36213ec22be6bb3f1fca31585b25d20))
* **main:** release 0.17.6 ([#86](https://github.com/zachowj/xfinity-data-usage/issues/86)) ([b7c780c](https://github.com/zachowj/xfinity-data-usage/commit/b7c780c8b6473c6226c8e88d9ca6f37dbcdf5c45))
* **main:** release 0.17.7 ([#87](https://github.com/zachowj/xfinity-data-usage/issues/87)) ([cd6521a](https://github.com/zachowj/xfinity-data-usage/commit/cd6521a0ed14fb2f8acdca280ee222c691c20103))
* **main:** release 0.17.8 ([#88](https://github.com/zachowj/xfinity-data-usage/issues/88)) ([e85b7c5](https://github.com/zachowj/xfinity-data-usage/commit/e85b7c5ed4f8234ecf577fa12696091bd453859b))
* **main:** release 0.18.0 ([#93](https://github.com/zachowj/xfinity-data-usage/issues/93)) ([55784d6](https://github.com/zachowj/xfinity-data-usage/commit/55784d6f3c1aa13c3d11c35cf92b5833d64e01ea))
* **main:** release 0.18.1 ([#107](https://github.com/zachowj/xfinity-data-usage/issues/107)) ([c2290e7](https://github.com/zachowj/xfinity-data-usage/commit/c2290e7884a6826791ab5ec8f9f52c3873a29f2e))
* **main:** release 0.19.0 ([#124](https://github.com/zachowj/xfinity-data-usage/issues/124)) ([5b3494c](https://github.com/zachowj/xfinity-data-usage/commit/5b3494c054c3f760bd0254d644c33deb9b50ab9f))
* **main:** release 0.2.1 ([#128](https://github.com/zachowj/xfinity-data-usage/issues/128)) ([fbf7926](https://github.com/zachowj/xfinity-data-usage/commit/fbf79269ffe55f307b2d15f0cb751040d27759ec))
* **main:** release 0.20.0 ([#127](https://github.com/zachowj/xfinity-data-usage/issues/127)) ([bb5e2c1](https://github.com/zachowj/xfinity-data-usage/commit/bb5e2c1d9be6d01d0414dd2f4f31be15bab6b1e7))
* release 0.10.0 ([#18](https://github.com/zachowj/xfinity-data-usage/issues/18)) ([8590cf9](https://github.com/zachowj/xfinity-data-usage/commit/8590cf92c6fc7f412ae284cd398769db8b172fc1))
* release 0.11.0 ([#21](https://github.com/zachowj/xfinity-data-usage/issues/21)) ([1b75c40](https://github.com/zachowj/xfinity-data-usage/commit/1b75c40494a0ecd9be31277f8bda74b82c8e2a4d))
* release 0.11.1 ([#22](https://github.com/zachowj/xfinity-data-usage/issues/22)) ([04fd7d0](https://github.com/zachowj/xfinity-data-usage/commit/04fd7d055a3f2d68da372747b22a1463a3dd3790))
* release 0.11.2 ([#23](https://github.com/zachowj/xfinity-data-usage/issues/23)) ([5576ca8](https://github.com/zachowj/xfinity-data-usage/commit/5576ca8ec5a7d2cbf7ceec92e6ca0670ec62a844))
* release 0.11.3 ([#24](https://github.com/zachowj/xfinity-data-usage/issues/24)) ([db5567f](https://github.com/zachowj/xfinity-data-usage/commit/db5567f41466d846c33bf30c2e098ba95e667484))
* release 0.11.4 ([#25](https://github.com/zachowj/xfinity-data-usage/issues/25)) ([b3bc95f](https://github.com/zachowj/xfinity-data-usage/commit/b3bc95f032b2c6171b2cd557a3ed773b979f7a04))
* release 0.11.5 ([#26](https://github.com/zachowj/xfinity-data-usage/issues/26)) ([379e171](https://github.com/zachowj/xfinity-data-usage/commit/379e1714331c6cbe7c369b638d77d4b634b9725b))
* release 0.11.6 ([#27](https://github.com/zachowj/xfinity-data-usage/issues/27)) ([76abf67](https://github.com/zachowj/xfinity-data-usage/commit/76abf67a19a578921a0b2d004ee08461c96b80a9))
* release 0.12.0 ([#28](https://github.com/zachowj/xfinity-data-usage/issues/28)) ([80c38d8](https://github.com/zachowj/xfinity-data-usage/commit/80c38d8a7bf64c1925b864254aa9468887910bf1))
* release 0.12.1 ([#29](https://github.com/zachowj/xfinity-data-usage/issues/29)) ([6c9fa13](https://github.com/zachowj/xfinity-data-usage/commit/6c9fa13d1f5921b4245c4eee0b465ac2f14330b0))
* release 0.12.2 ([#31](https://github.com/zachowj/xfinity-data-usage/issues/31)) ([f8db1ea](https://github.com/zachowj/xfinity-data-usage/commit/f8db1eaf861e6e10aaf78307287732a3539b12c2))
* release 0.12.3 ([1c43228](https://github.com/zachowj/xfinity-data-usage/commit/1c43228cf4c08f4560c9644a668495e5cf0b6075))
* release 0.12.3 ([#32](https://github.com/zachowj/xfinity-data-usage/issues/32)) ([45cd4e5](https://github.com/zachowj/xfinity-data-usage/commit/45cd4e502054453e37989a8cdb40cbd9c5e4386b))
* release 0.13.0 ([#34](https://github.com/zachowj/xfinity-data-usage/issues/34)) ([7699388](https://github.com/zachowj/xfinity-data-usage/commit/76993884fd8102d82dc49b729e6f9e3e23f33086))
* release 0.13.1 ([#35](https://github.com/zachowj/xfinity-data-usage/issues/35)) ([355e502](https://github.com/zachowj/xfinity-data-usage/commit/355e50261a20bb832c6ca2e59aad296615968013))
* release 0.13.2 ([#36](https://github.com/zachowj/xfinity-data-usage/issues/36)) ([8ccd041](https://github.com/zachowj/xfinity-data-usage/commit/8ccd041385c0955e133c8a0c5d6993f016ea699c))
* release 0.14.0 ([#40](https://github.com/zachowj/xfinity-data-usage/issues/40)) ([cab6940](https://github.com/zachowj/xfinity-data-usage/commit/cab6940c9ae49da7e3784adbf1f23b251b683ec2))
* release 0.15.0 ([#41](https://github.com/zachowj/xfinity-data-usage/issues/41)) ([d52c7c6](https://github.com/zachowj/xfinity-data-usage/commit/d52c7c60c040f6e525c112c98b04ed7d66054ba1))
* release 0.15.1 ([#42](https://github.com/zachowj/xfinity-data-usage/issues/42)) ([ee5ebbb](https://github.com/zachowj/xfinity-data-usage/commit/ee5ebbb01d30a93e825913bc9429b121e96303ee))
* release 0.15.2 ([#43](https://github.com/zachowj/xfinity-data-usage/issues/43)) ([e8c8d5f](https://github.com/zachowj/xfinity-data-usage/commit/e8c8d5fb6aab3363460881d30c7f752655805add))
* release 0.15.3 ([#44](https://github.com/zachowj/xfinity-data-usage/issues/44)) ([e9f3691](https://github.com/zachowj/xfinity-data-usage/commit/e9f36910c7518e7a177391f3b7e9a294d84fad0b))
* release 0.16.0 ([#47](https://github.com/zachowj/xfinity-data-usage/issues/47)) ([6bac285](https://github.com/zachowj/xfinity-data-usage/commit/6bac28536456cb638ae71471da974a1234e5c849))
* release 0.16.1 ([#48](https://github.com/zachowj/xfinity-data-usage/issues/48)) ([833fa17](https://github.com/zachowj/xfinity-data-usage/commit/833fa170e5e53431ec86071c181eb192ae872b1c))
* release 0.17.0 ([#50](https://github.com/zachowj/xfinity-data-usage/issues/50)) ([8c8c035](https://github.com/zachowj/xfinity-data-usage/commit/8c8c035076e2aa33d25774bef0c4f95c294dd4a1))
* release 0.17.1 ([#52](https://github.com/zachowj/xfinity-data-usage/issues/52)) ([bec24c5](https://github.com/zachowj/xfinity-data-usage/commit/bec24c536662e32919c7ac2186f11d2f1c3579df))
* release 0.17.2 ([#56](https://github.com/zachowj/xfinity-data-usage/issues/56)) ([1609527](https://github.com/zachowj/xfinity-data-usage/commit/1609527492e918aafb2fa1625726c2a5da34ee26))
* release 0.17.4 ([ab917d5](https://github.com/zachowj/xfinity-data-usage/commit/ab917d58a386a2c187ab5b00a811ff10e4327cc4))
* release 0.18.0 ([249d4f6](https://github.com/zachowj/xfinity-data-usage/commit/249d4f6d8df08284a2ba2e0495149004d942b6d5))
* release 0.2.1 ([f62d862](https://github.com/zachowj/xfinity-data-usage/commit/f62d862925d5e964c0dcd8d8b8ca3abc85685d74))
* release 0.20.2 ([0ec67e5](https://github.com/zachowj/xfinity-data-usage/commit/0ec67e5197e2d027ee7bfb930ce62250fbd5a514))
* release 0.4.0 ([#2](https://github.com/zachowj/xfinity-data-usage/issues/2)) ([9987875](https://github.com/zachowj/xfinity-data-usage/commit/9987875d84da55644f906a1c0f5faa4475c7f46b))
* release 0.4.1 ([#3](https://github.com/zachowj/xfinity-data-usage/issues/3)) ([a99d02a](https://github.com/zachowj/xfinity-data-usage/commit/a99d02a3b074f0f4d8212e376ca4eae3ca21f71f))
* release 0.5.0 ([#4](https://github.com/zachowj/xfinity-data-usage/issues/4)) ([76046d0](https://github.com/zachowj/xfinity-data-usage/commit/76046d03237d6aa77a32f95c3792cb3b250c9bfc))
* release 0.5.1 ([#5](https://github.com/zachowj/xfinity-data-usage/issues/5)) ([ae2ad1e](https://github.com/zachowj/xfinity-data-usage/commit/ae2ad1e14a50f3b54084e4a573a1c08b95d8947c))
* release 0.6.0 ([#7](https://github.com/zachowj/xfinity-data-usage/issues/7)) ([cd7a134](https://github.com/zachowj/xfinity-data-usage/commit/cd7a1342eb74740217b9938e6fe35bb92ef39f52))
* release 0.6.1 ([#8](https://github.com/zachowj/xfinity-data-usage/issues/8)) ([700b1a8](https://github.com/zachowj/xfinity-data-usage/commit/700b1a8795cf082832b2ed3524ae8936f8f9db0b))
* release 0.6.2 ([#9](https://github.com/zachowj/xfinity-data-usage/issues/9)) ([d9dee7c](https://github.com/zachowj/xfinity-data-usage/commit/d9dee7cee1a57435019de49cd6f7cbbc490c00bc))
* release 0.7.0 ([#10](https://github.com/zachowj/xfinity-data-usage/issues/10)) ([da0fe06](https://github.com/zachowj/xfinity-data-usage/commit/da0fe060c0a0940bdcd9d193a396b7ae18027dda))
* release 0.8.0 ([#11](https://github.com/zachowj/xfinity-data-usage/issues/11)) ([da920aa](https://github.com/zachowj/xfinity-data-usage/commit/da920aae738af977be34257520643be03150a4c5))
* release 0.9.0 ([#12](https://github.com/zachowj/xfinity-data-usage/issues/12)) ([d556a72](https://github.com/zachowj/xfinity-data-usage/commit/d556a72bc79747804e47946ca282678a82842978))
* release 0.9.1 ([#16](https://github.com/zachowj/xfinity-data-usage/issues/16)) ([07d56b0](https://github.com/zachowj/xfinity-data-usage/commit/07d56b060c24c623cc15081095a79aae32533f31))
* release 0.9.2 ([#17](https://github.com/zachowj/xfinity-data-usage/issues/17)) ([b4deae2](https://github.com/zachowj/xfinity-data-usage/commit/b4deae2f72fae926b5647603cf37e74d35a36487))
* remove a console.log ([74d2fac](https://github.com/zachowj/xfinity-data-usage/commit/74d2fac3ac2eb29656e396732e5d72cd98db8a45))
* remove some comments ([01ff0ac](https://github.com/zachowj/xfinity-data-usage/commit/01ff0aca11f3991480775ec76f2a1770a7fe85a3))
* Revent release please action changes ([326c49e](https://github.com/zachowj/xfinity-data-usage/commit/326c49e854c88d7775f89bb2a771e5c7d20a95d2))
* update dependencies ([b9b7a4c](https://github.com/zachowj/xfinity-data-usage/commit/b9b7a4c0759e751f0df43f3405ac6f9fa51bbcb3))
* Update dependencies ([a2876d9](https://github.com/zachowj/xfinity-data-usage/commit/a2876d924679b1732821fa0d11be681873e22b66))
* Update dependencies ([7fa9d9c](https://github.com/zachowj/xfinity-data-usage/commit/7fa9d9c54c239f35284b7860f41bd98da0682e97))
* Update dependencies ([ca9822e](https://github.com/zachowj/xfinity-data-usage/commit/ca9822e69a2c35a27910ff8db2b2a98589f48f93))
* update puppeteer changes ([82edec1](https://github.com/zachowj/xfinity-data-usage/commit/82edec1e01dd258eacd75fa2760d40d310992653))

## [0.2.1](https://github.com/zachowj/xfinity-data-usage/compare/v0.20.0...v0.2.1) (2023-07-22)


### Miscellaneous

* release 0.2.1 ([f62d862](https://github.com/zachowj/xfinity-data-usage/commit/f62d862925d5e964c0dcd8d8b8ca3abc85685d74))

## [0.20.0](https://github.com/zachowj/xfinity-data-usage/compare/v0.19.0...v0.20.0) (2023-07-22)


### Features

* Add reading/writing cookies back in ([b07f6ee](https://github.com/zachowj/xfinity-data-usage/commit/b07f6ee88c2d49a2c3a05bc55e77dbdbfa8ea9d8))


### Bug Fixes

* Replace Request with axios ([8ebdd90](https://github.com/zachowj/xfinity-data-usage/commit/8ebdd90ffff2c3345525e19476a8709a27184201))


### Miscellaneous

* **deps:** Update dependencies ([8ebdd90](https://github.com/zachowj/xfinity-data-usage/commit/8ebdd90ffff2c3345525e19476a8709a27184201))

## [0.19.0](https://github.com/zachowj/xfinity-data-usage/compare/v0.18.1...v0.19.0) (2023-07-20)


### Features

* Use a stealth plugin ([e1ce0da](https://github.com/zachowj/xfinity-data-usage/commit/e1ce0da112968ad92a71f391185694db0802eb04))


### Miscellaneous

* **deps-dev:** bump @types/node from 18.16.19 to 20.4.1 ([#123](https://github.com/zachowj/xfinity-data-usage/issues/123)) ([53b9513](https://github.com/zachowj/xfinity-data-usage/commit/53b951380a6276db951f7b2b6b6f5f5ca27fcdb2))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#122](https://github.com/zachowj/xfinity-data-usage/issues/122)) ([b8fbd01](https://github.com/zachowj/xfinity-data-usage/commit/b8fbd0116efb1d3f322e475b3989f9a6331dfffc))
* **deps-dev:** bump @typescript-eslint/parser from 5.62.0 to 6.1.0 ([#125](https://github.com/zachowj/xfinity-data-usage/issues/125)) ([95496b2](https://github.com/zachowj/xfinity-data-usage/commit/95496b2f67c4c98a81f3a644b497ff2e3a6c79ee))
* **deps-dev:** bump eslint-plugin-n from 15.7.0 to 16.0.1 ([#119](https://github.com/zachowj/xfinity-data-usage/issues/119)) ([6b028e4](https://github.com/zachowj/xfinity-data-usage/commit/6b028e4c2f3557871cfb89c67b950b4ffd8f2a31))
* **deps-dev:** bump eslint-plugin-prettier from 4.2.1 to 5.0.0 ([#126](https://github.com/zachowj/xfinity-data-usage/issues/126)) ([e5d0fb7](https://github.com/zachowj/xfinity-data-usage/commit/e5d0fb7f29c028716ea5e14b80894f966597dda7))
* **deps-dev:** bump prettier from 2.8.8 to 3.0.0 ([#121](https://github.com/zachowj/xfinity-data-usage/issues/121)) ([173231a](https://github.com/zachowj/xfinity-data-usage/commit/173231a8e466c6e39dc65bd4cdee551edea6ed78))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#117](https://github.com/zachowj/xfinity-data-usage/issues/117)) ([8ae9407](https://github.com/zachowj/xfinity-data-usage/commit/8ae9407668f04f541814311c16d1fb116551f44d))

## [0.18.1](https://github.com/zachowj/xfinity-data-usage/compare/v0.18.0...v0.18.1) (2023-04-22)


### Bug Fixes

* Add missing await to startOver ([aff1cb7](https://github.com/zachowj/xfinity-data-usage/commit/aff1cb716058948c98d5b857f26510614457a386)), closes [#108](https://github.com/zachowj/xfinity-data-usage/issues/108)


### Miscellaneous

* **deps:** bump GoogleCloudPlatform/release-please-action ([#105](https://github.com/zachowj/xfinity-data-usage/issues/105)) ([7b390b8](https://github.com/zachowj/xfinity-data-usage/commit/7b390b82139fe9e84bfa1cd91686390f0f8f26d1))

## [0.18.0](https://github.com/zachowj/xfinity-data-usage/compare/v0.17.8...v0.18.0) (2023-04-13)


### Bug Fixes

* Remove deleted directory from dockerfile ([67c70fa](https://github.com/zachowj/xfinity-data-usage/commit/67c70fa28d820aa247be6e0fff3a4f55dee77bba))


### Documentation

* Update README ([c32d7d4](https://github.com/zachowj/xfinity-data-usage/commit/c32d7d46d35e7f0d83ae77130904973ee79197f3))


### Miscellaneous

* **deps-dev:** bump eslint-plugin-simple-import-sort ([#92](https://github.com/zachowj/xfinity-data-usage/issues/92)) ([ca01301](https://github.com/zachowj/xfinity-data-usage/commit/ca01301f3eac5a1e982c25cc43184c344523e92b))
* **deps-dev:** bump eslint-plugin-simple-import-sort ([#95](https://github.com/zachowj/xfinity-data-usage/issues/95)) ([8457fe1](https://github.com/zachowj/xfinity-data-usage/commit/8457fe1f3f6f60128a1e278a1366a9ac040434ca))
* **deps-dev:** bump typescript from 4.9.5 to 5.0.3 ([#101](https://github.com/zachowj/xfinity-data-usage/issues/101)) ([abdb62c](https://github.com/zachowj/xfinity-data-usage/commit/abdb62cfb39a142d819ac0851295b870f5bcddaa))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#100](https://github.com/zachowj/xfinity-data-usage/issues/100)) ([43b1298](https://github.com/zachowj/xfinity-data-usage/commit/43b12980795e9968b3cefaf39ed1aeafcac3c099))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#103](https://github.com/zachowj/xfinity-data-usage/issues/103)) ([4b51609](https://github.com/zachowj/xfinity-data-usage/commit/4b516094cb246bb302df3d3331c2318ed1d0a36f))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#91](https://github.com/zachowj/xfinity-data-usage/issues/91)) ([64b360a](https://github.com/zachowj/xfinity-data-usage/commit/64b360a4edc75f8880664afff9a828fe943ef2b8))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#94](https://github.com/zachowj/xfinity-data-usage/issues/94)) ([6e31971](https://github.com/zachowj/xfinity-data-usage/commit/6e31971bf3ab6a0324aa246d56edeaef728162bc))
* **deps:** bump GoogleCloudPlatform/release-please-action ([#97](https://github.com/zachowj/xfinity-data-usage/issues/97)) ([f21f79f](https://github.com/zachowj/xfinity-data-usage/commit/f21f79f279327264c6023f382458ca04ca2cdaf0))
* release 0.18.0 ([249d4f6](https://github.com/zachowj/xfinity-data-usage/commit/249d4f6d8df08284a2ba2e0495149004d942b6d5))

## [0.17.8](https://github.com/zachowj/xfinity-data-usage/compare/v0.17.7...v0.17.8) (2022-12-15)


### Bug Fixes

* Don't commit late at night ([ebdc1b5](https://github.com/zachowj/xfinity-data-usage/commit/ebdc1b50b02b6a7a9df9e38bb4f3ea05b8da9c75))

## [0.17.7](https://github.com/zachowj/xfinity-data-usage/compare/v0.17.6...v0.17.7) (2022-12-15)


### Bug Fixes

* Add yarn timeout to dockerfile ([f48a4c8](https://github.com/zachowj/xfinity-data-usage/commit/f48a4c8016de4cd204db50a4b0af97d906c337e7))

## [0.17.6](https://github.com/zachowj/xfinity-data-usage/compare/v0.17.5...v0.17.6) (2022-12-15)


### Bug Fixes

* Attempt to fix yarn timeout in docker build ([6364a73](https://github.com/zachowj/xfinity-data-usage/commit/6364a737634d10aeb8b5830789e1ea2a105b30e1))

## [0.17.5](https://github.com/zachowj/xfinity-data-usage/compare/v0.17.4...v0.17.5) (2022-12-15)


### Bug Fixes

* Send bearer token when fetching data json ([15b5f1e](https://github.com/zachowj/xfinity-data-usage/commit/15b5f1ed63dbb007e1c236563551ad92bab00e19))


### Miscellaneous

* **deps:** bump GoogleCloudPlatform/release-please-action ([#83](https://github.com/zachowj/xfinity-data-usage/issues/83)) ([e38d3a0](https://github.com/zachowj/xfinity-data-usage/commit/e38d3a0e789b2a5822e81b49dd2a304795f5e5cc))

### [0.17.2](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.17.1...v0.17.2) (2022-09-22)


### Documentation

* Update README typo ([#55](https://www.github.com/zachowj/xfinity-data-usage/issues/55)) ([53b2663](https://www.github.com/zachowj/xfinity-data-usage/commit/53b2663d92781060109f739beae3c87700d979a6))


### Miscellaneous

* update puppeteer changes ([82edec1](https://www.github.com/zachowj/xfinity-data-usage/commit/82edec1e01dd258eacd75fa2760d40d310992653))
* **deps:** bump puppeteer-core from 10.4.0 to 18.0.5 ([#65](https://www.github.com/zachowj/xfinity-data-usage/issues/65)) ([21ac4f2](https://www.github.com/zachowj/xfinity-data-usage/commit/21ac4f225ef7abf51d4c65a217abbe0e8c7922ab))
* **deps-dev:** bump @types/pino from 6.3.12 to 7.0.5 ([#64](https://www.github.com/zachowj/xfinity-data-usage/issues/64)) ([c87c243](https://www.github.com/zachowj/xfinity-data-usage/commit/c87c2436775f3e10b6e5de5a2294afb7165538a5))
* **deps-dev:** bump eslint from 7.32.0 to 8.23.1 ([#62](https://www.github.com/zachowj/xfinity-data-usage/issues/62)) ([27290df](https://www.github.com/zachowj/xfinity-data-usage/commit/27290df2962271e9c921197ba28d39102a80574d))
* **deps-dev:** bump eslint-plugin-promise from 5.2.0 to 6.0.1 ([#63](https://www.github.com/zachowj/xfinity-data-usage/issues/63)) ([3eb851d](https://www.github.com/zachowj/xfinity-data-usage/commit/3eb851d1e3b65d57fd52cc443894009b38ac0126))
* **deps-dev:** bump eslint-plugin-simple-import-sort ([#61](https://www.github.com/zachowj/xfinity-data-usage/issues/61)) ([57e6398](https://www.github.com/zachowj/xfinity-data-usage/commit/57e639872bf19fbc3f0b65853f8133076d724d4c))

### [0.17.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.17.0...v0.17.1) (2021-12-07)


### Miscellaneous

* force release ([20de8dd](https://www.github.com/zachowj/xfinity-data-usage/commit/20de8dddcc1833cfa15bb4a950b0da2a477da22b))

## [0.17.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.16.1...v0.17.0) (2021-09-20)


### Features

* Update to node 16 ([b210c51](https://www.github.com/zachowj/xfinity-data-usage/commit/b210c51cd33f53ac1e520251ff74ad937ac76750))


### Bug Fixes

* Always close brower session ([7404be4](https://www.github.com/zachowj/xfinity-data-usage/commit/7404be4bfa0f70c82898eb4ebd8112bffd44f9aa))


### Miscellaneous

* Add inspect script and open port in dev docker container ([e1125b6](https://www.github.com/zachowj/xfinity-data-usage/commit/e1125b6a7e0eccf9d35be7ccd627b0571086cfd4))
* Add log about password reset ([3d85dd6](https://www.github.com/zachowj/xfinity-data-usage/commit/3d85dd674819b072d350ff34ff52f9154de4d1ae))
* Update dependencies ([a2876d9](https://www.github.com/zachowj/xfinity-data-usage/commit/a2876d924679b1732821fa0d11be681873e22b66))

### [0.16.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.16.0...v0.16.1) (2021-09-14)


### Bug Fixes

* Don't wait for the username field as it could be hidden ([ab90889](https://www.github.com/zachowj/xfinity-data-usage/commit/ab90889985ebdba85f3364db9d97b0481981e447))

## [0.16.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.15.3...v0.16.0) (2021-09-13)


### Features

* Configurable config folder ([#46](https://www.github.com/zachowj/xfinity-data-usage/issues/46)) ([736e8de](https://www.github.com/zachowj/xfinity-data-usage/commit/736e8de2a781c8a6162b5d506f1b7dfd0b33be86))

### [0.15.3](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.15.2...v0.15.3) (2021-09-10)


### Bug Fixes

* Wait for pre selector on json page ([af13d95](https://www.github.com/zachowj/xfinity-data-usage/commit/af13d959191831122d714088153fdd916b6a3482))

### [0.15.2](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.15.1...v0.15.2) (2021-09-09)


### Miscellaneous

* Update dependencies ([7fa9d9c](https://www.github.com/zachowj/xfinity-data-usage/commit/7fa9d9c54c239f35284b7860f41bd98da0682e97))

### [0.15.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.15.0...v0.15.1) (2021-09-08)


### Bug Fixes

* remove console.log ([6ce6cee](https://www.github.com/zachowj/xfinity-data-usage/commit/6ce6cee5dc64f161225fdd1a795203c1b0fdd5b0))

## [0.15.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.14.0...v0.15.0) (2021-09-08)


### Features

* Add logging levels ([4bb38f7](https://www.github.com/zachowj/xfinity-data-usage/commit/4bb38f7c1e2572b6cf131376208d1568f58fa857))


### Miscellaneous

* Revent release please action changes ([326c49e](https://www.github.com/zachowj/xfinity-data-usage/commit/326c49e854c88d7775f89bb2a771e5c7d20a95d2))

## [0.14.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.13.2...v0.14.0) (2021-09-07)


### Features

* Add check for confirmation element after reseting password ([a6b8ee0](https://www.github.com/zachowj/xfinity-data-usage/commit/a6b8ee0565358c8c715b5d211a246490375f3b31))
* Maintain Xfinity account session (less password resets) ([#39](https://www.github.com/zachowj/xfinity-data-usage/issues/39)) ([ffaac34](https://www.github.com/zachowj/xfinity-data-usage/commit/ffaac348de25c28f7fffbd3a7d0f5a5924c8d437))

### [0.13.2](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.13.1...v0.13.2) (2021-08-15)


### Miscellaneous

* remove a console.log ([74d2fac](https://www.github.com/zachowj/xfinity-data-usage/commit/74d2fac3ac2eb29656e396732e5d72cd98db8a45))

### [0.13.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.13.0...v0.13.1) (2021-08-15)


### Bug Fixes

* Handle first run without password file ([2fa4fc7](https://www.github.com/zachowj/xfinity-data-usage/commit/2fa4fc7fbeb8173a36e4e8023261757fa76e54c2))

## [0.13.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.12.3...v0.13.0) (2021-08-12)


### Features

* Add incremental suffix to password when resetting ([b6009cf](https://www.github.com/zachowj/xfinity-data-usage/commit/b6009cf9e6b15e1db26c73dc204c079b0adaddc4))

### [0.12.3](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.12.2...v0.12.3) (2021-07-13)


### Miscellaneous

* release 0.12.3 ([1c43228](https://www.github.com/zachowj/xfinity-data-usage/commit/1c43228cf4c08f4560c9644a668495e5cf0b6075))

### [0.12.2](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.12.1...v0.12.2) (2021-07-13)


### Bug Fixes

* Remove URL parsing ([a155ef4](https://www.github.com/zachowj/xfinity-data-usage/commit/a155ef4b1cb87874056383ba64be70799c0ee6b7)), closes [#30](https://www.github.com/zachowj/xfinity-data-usage/issues/30)

### [0.12.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.12.0...v0.12.1) (2021-07-09)


### Bug Fixes

* Fix param type cast ([69d39b4](https://www.github.com/zachowj/xfinity-data-usage/commit/69d39b4b75d100fdfe0b842c94c378a24687aec2))


### Miscellaneous

* Update dependencies ([ca9822e](https://www.github.com/zachowj/xfinity-data-usage/commit/ca9822e69a2c35a27910ff8db2b2a98589f48f93))

## [0.12.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.11.6...v0.12.0) (2021-07-09)


### Features

* Spawn xfinity as a child process ([8503b44](https://www.github.com/zachowj/xfinity-data-usage/commit/8503b445dfbc6b1bad7d664a81cd0031561759a7))

### [0.11.6](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.11.5...v0.11.6) (2021-07-02)


### Bug Fixes

* Clear setTimeout if code is found ([3dd41b7](https://www.github.com/zachowj/xfinity-data-usage/commit/3dd41b7ce7ce3559b820700233b13027963c3255))

### [0.11.5](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.11.4...v0.11.5) (2021-06-28)


### Bug Fixes

* catch errors throw from imap ([069e8c9](https://www.github.com/zachowj/xfinity-data-usage/commit/069e8c9425f65c1d7d36b4573ff8e5e45e2d454c))

### [0.11.4](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.11.3...v0.11.4) (2021-06-24)


### Bug Fixes

* improved error handling of imap flow ([1e2ae93](https://www.github.com/zachowj/xfinity-data-usage/commit/1e2ae93a7912f1f98baa230f4097f7466924a9ea))


### Documentation

* fix imap.auth.pass location in readme ([9475f05](https://www.github.com/zachowj/xfinity-data-usage/commit/9475f05aa02f73768ec5a4c184b35ce5e6e522d4))
* Update path for imap auth ([8a9a817](https://www.github.com/zachowj/xfinity-data-usage/commit/8a9a817bc498885751dd733141186bcd4eb13072))

### [0.11.3](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.11.2...v0.11.3) (2021-06-24)


### Bug Fixes

* possible fix for imapflow import ([9ea5d4d](https://www.github.com/zachowj/xfinity-data-usage/commit/9ea5d4d23ec1c32a8f249507377eb1a88c44403c))

### [0.11.2](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.11.1...v0.11.2) (2021-06-23)


### Bug Fixes

* **build:** Copy types dir for the docker build ([906100b](https://www.github.com/zachowj/xfinity-data-usage/commit/906100b0d54d6d78e3f9ba4750dc46fbb907971a))

### [0.11.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.11.0...v0.11.1) (2021-06-23)


### Bug Fixes

* Don't catch imap connection errors ([4fd7535](https://www.github.com/zachowj/xfinity-data-usage/commit/4fd753523295bcf50658735f608fd027ddc70ab6))

## [0.11.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.10.0...v0.11.0) (2021-06-23)


### Features

* Add imap option to automatically reset xfinity password ([1d347a4](https://www.github.com/zachowj/xfinity-data-usage/commit/1d347a4f3437be853bad17e58b5f3a49e5a3e076))

## [0.10.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.9.2...v0.10.0) (2021-04-30)


### Features

* Reject requests for images, fonts and domains not *xfinity.com ([a3d2091](https://www.github.com/zachowj/xfinity-data-usage/commit/a3d20915177c39b7a965c2dbaec45d1e5185bc6f))

### [0.9.2](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.9.1...v0.9.2) (2021-04-30)


### Bug Fixes

* Possible fix for [#14](https://www.github.com/zachowj/xfinity-data-usage/issues/14) ([9c6fa0a](https://www.github.com/zachowj/xfinity-data-usage/commit/9c6fa0a85e9ab3a09f36a97bacc00b931bdc387c))

### [0.9.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.9.0...v0.9.1) (2021-04-27)


### Bug Fixes

* Wait for title element to be loaded before reading it ([8c56aef](https://www.github.com/zachowj/xfinity-data-usage/commit/8c56aef5270cde464717d6e008ab734fa0108c6a))

## [0.9.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.8.0...v0.9.0) (2020-10-07)


### Features

* add dumb-init ([679d2ba](https://www.github.com/zachowj/xfinity-data-usage/commit/679d2ba596394b7e138325de08ac02d7c37b1719))


### Bug Fixes

* mem leak fix? ([3ef267c](https://www.github.com/zachowj/xfinity-data-usage/commit/3ef267ce18795af262a0588e5111f66a4f132eba))


### Miscellaneous

* update dependencies ([b9b7a4c](https://www.github.com/zachowj/xfinity-data-usage/commit/b9b7a4c0759e751f0df43f3405ac6f9fa51bbcb3))

## [0.8.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.7.0...v0.8.0) (2020-09-07)


### Features

* run buster-slim as the final build image ([f0adc4a](https://www.github.com/zachowj/xfinity-data-usage/commit/f0adc4a4ab99f32bedbab3fa5ffd9212f1131fee))

## [0.7.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.6.2...v0.7.0) (2020-09-07)


### Features

* switch to alpine for the final build ([ce2098b](https://www.github.com/zachowj/xfinity-data-usage/commit/ce2098b14f8fcaf35516931567598d0b8b737fd7))

### [0.6.2](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.6.1...v0.6.2) (2020-09-06)


### Bug Fixes

* check if page is still valid ([1a2ee00](https://www.github.com/zachowj/xfinity-data-usage/commit/1a2ee00bd2a92afa9e1f3c0d6d75dec580dca662))

### [0.6.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.6.0...v0.6.1) (2020-09-06)


### Bug Fixes

* wait for page load after security check ([3b29083](https://www.github.com/zachowj/xfinity-data-usage/commit/3b290831299aa815f1e2140bd9a30ea7d8c24920))

## [0.6.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.5.1...v0.6.0) (2020-09-06)


### Features

* Add configurable pageTimeout for puppeteer ([c019e17](https://www.github.com/zachowj/xfinity-data-usage/commit/c019e173db98713eb5d89f110e34e95aa22d9040))


### Bug Fixes

* correct firefox spelling ([6453a78](https://www.github.com/zachowj/xfinity-data-usage/commit/6453a780ea00596f3e47bd54c5358535a0fa6f7b))

### [0.5.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.5.0...v0.5.1) (2020-09-06)


### Bug Fixes

* add launch option disable-setuid-sandbox ([0ebfd73](https://www.github.com/zachowj/xfinity-data-usage/commit/0ebfd73b5395b10f88f170dbd293def7dd87492f))

## [0.5.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.4.1...v0.5.0) (2020-09-05)


### Features

* Replace geckodriver and selenium with chromium and puppeteer ([22bd274](https://www.github.com/zachowj/xfinity-data-usage/commit/22bd2745c35a1655ae9bcc1eead20886c617e354))

### [0.4.1](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.4.0...v0.4.1) (2020-09-02)


### Bug Fixes

* Use correct docker link in README ([15b9cc9](https://www.github.com/zachowj/xfinity-data-usage/commit/15b9cc961a2a6d490ae8b42456d440c884da5a83))
* use correct package name in action ([10d0c6f](https://www.github.com/zachowj/xfinity-data-usage/commit/10d0c6f6df96bfadb04905d372974f97afc2a3af))

## [0.4.0](https://www.github.com/zachowj/xfinity-data-usage/compare/v0.3.1...v0.4.0) (2020-09-01)


### Features

* Add limit to retry logging in ([add3105](https://www.github.com/zachowj/xfinity-data-usage/commit/add3105d41e7a01ffa1e3a4866ef3e2b1569b00d))
