## Random, maybe useful
* [Cap FPS for Chromium with software rendering --use-gl=swiftshader](https://gist.github.com/niespodd/c7fd14e0e58652e74c0f1fdbd819112d) - Limit CPU usage from SwiftShader by redraw freq. of Chromium in AVD 

## [puppeteer-extra-plugin-stealth 😈](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)

✔️ Win / ❌ Fail / 👔 Tie :
* [👔 p0f - detect host OS from TCP struct](https://en.wikipedia.org/wiki/P0f) - Not possible to fix via Puppeteer APIs. Used in [Akamai Bot Manager](https://www.akamai.com/uk/en/products/security/bot-manager.jsp) to match against JS and browser headers (Client Hints and `User-Agent`). There is a [detailed explaination of the issue](https://nmap.org/misc/defeat-nmap-osdetect.html). The most reliable evasion seems to be not spoofing host OS at all, or using [OSfooler-ng](https://github.com/segofensiva/OSfooler-ng).
* 👔 **Browser dimensions** - Although [stealth plugin provides `window.outerdimensions` evasion](https://github.com/berstend/puppeteer-extra/blob/master/packages/puppeteer-extra-plugin-stealth/evasions/window.outerdimensions/index.js#L25), it won't work without correct config on non-default OS in headless mode; almost always fails when `viewport size >= screen resolution` (low screen resolution display on the host). 
* [❌ core-estimator - detect mismatch between navigator.hardwareConcurrency and SW/WW execution profile](https://github.com/oftn-oswg/core-estimator/blob/master/core-estimator.js) - Not possible to limit/bump the `ServiceWorker`/`WebWorker` thread limit via existng Puppeteer APIs.
* ❌ **WebGL extensions profiling** - desc. tbd
* ❌ **RTCPeerConnection when behind a proxy** - Applies to both SOCKS and HTTP(S) proxies.
* ❌ **Performance.now** - desc. tbd (red pill)
* ❌ **WebGL profiling** - desc. tbd
* ❌ **Client Hints** - desc. tbd
* ❌ **Behavior Detection** - desc. tbd (events, params, ML+AI buzz)
* ❌ **Font fingerprinting** - desc. tbd (list+version+renderer via HTML&canvas)
* ❌ **Network Latency** - desc. tbd (integrity check: proxy det., JS networkinfo, dns resolv profiling&timing)
* ❌ **Battery API** - desc. tbd 
* ❌ **Gyroscope and other (mostly mobile) device sensors ** - desc. tbd 

## [Multilogin](https://multilogin.com), [Kameleo](https://kameleo.io/), copycats and others

tbd

