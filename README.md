# Browser Fingerprinting 👫 Bot Detection 👨‍🔧 Technical dive

A ⭐ on this repo will be **appreciated**!

Here I study various aspects of existing evasion techniques to get around anti-bot systems. The technical findings that I am sharing below are based on observations of running web scraping scripts for a few months against websites protected by:
* [Akamai Bot Manager by Akamai](https://www.akamai.com/uk/en/products/security/bot-manager.jsp)
* [Advanced Bot Protection by Imperva (former Distil Networks)](https://www.imperva.com/products/advanced-bot-protection-management/)
* [DataDome](https://datadome.co/)
* [PerimeterX](https://www.perimeterx.com/)
* [Shape Security](https://www.shapesecurity.com/)

and a few other custom built (incl. social media platforms). [Having troubles bypassing one of them?](#support)

# Preface

Before I dive into technical details, I need to make a general remark to people who are evaluating (and/or) planning to introduce anti-bot software on their websites. **Anti-bot software is nonsense.** It's snake oil sold to people without technical knowledge for heavy bucks. Most of the time you do not need it.

Blocking bot traffic is based on the premise that you (or your technology provider) can **distinguish bots from real users**. To make this happen various techniques that I am discussing further in the document are applied. However, to date none of them appear to be successful against specialized web scrapering tools. In other words **anti-bot software is all about reducing cheap bot traffic** and most often only making the process more expensive and complicated, but **not entirely impossible** for the people running web scrapers.

Today anti-bot vendors apply two major techniques to detect (and block) bot traffic:

### Binary detection

No specialized web scraping software is used. Vendor can detect the bad traffic based on information openly disclosed by the scraper e.g. `User-Agent` header, connection parameters etc. 

As a result **only bots that are not targeted to scrape specific website are blocked**. This will make most of the managers happy, because the overall number of *bad traffic* goes down and it may almost look like there is no more bot traffic on the website. **Wrong.**

### Traffic clustering

More advanced web scrapers make use of residential proxies and implement complex evasion techniques to fool anti-bot software to think that the web scraper is a real user. No detection mechanism exists to get around this due to technical limitation of web browsers.

In this case, most of the time the vendor will be only able to **cluster the bad traffic** by finding patterns in bot traffic and behavior. The problem with banning the traffic here is that it may turn out to be a risky operation when bots are successfully mimicking real users. There is a chance that **by blocking bots the website will become unavailable to real visitors**.

### *Gateways, captchas & co*

If you think this is a way to go [google "captcha resolve api"](https://letmegooglethat.com/?q=captcha+resolve+api).

# Technicalities

*I constantly add stuff to this section.*

## Random, maybe useful
* [Cap FPS for Chromium with software rendering --use-gl=swiftshader](https://gist.github.com/niespodd/c7fd14e0e58652e74c0f1fdbd819112d) - Limit CPU usage from SwiftShader by redraw freq. of Chromium in AVD 
* Unlike some public comments on that matter **chrome devtools protocol actually works** on AVD-s with puppeteer 

## [puppeteer-extra-plugin-stealth 😈](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)

✔️ Win / ❌ Fail / 🤷 Tie :
* ✔️ **Client Hints** - [Shipped recently](https://github.com/berstend/puppeteer-extra/pull/413). In line with Chromium cpp implementation.
* ✔️ **General `navigator` and `window` properties**
* ✔️ **Chrome plugins and native extensions** - This includes both Widevine DRM extension, as well as Google Hangouts, safe-browsing etc.
* [🤷 p0f - detect host OS from TCP struct](https://en.wikipedia.org/wiki/P0f) - Not possible to fix via Puppeteer APIs. Used in [Akamai Bot Manager](https://www.akamai.com/uk/en/products/security/bot-manager.jsp) to match against JS and browser headers (Client Hints and `User-Agent`). There is a [detailed explaination of the issue](https://nmap.org/misc/defeat-nmap-osdetect.html). The most reliable evasion seems to be not spoofing host OS at all, or using [OSfooler-ng](https://github.com/segofensiva/OSfooler-ng).
* 🤷 **Browser dimensions** - Although [stealth plugin provides `window.outerdimensions` evasion](https://github.com/berstend/puppeteer-extra/blob/master/packages/puppeteer-extra-plugin-stealth/evasions/window.outerdimensions/index.js#L25), it won't work without correct config on non-default OS in headless mode; almost always fails when `viewport size >= screen resolution` (low screen resolution display on the host). 
* [❌ core-estimator](https://github.com/oftn-oswg/core-estimator/blob/master/core-estimator.js) - This can detect mismatch between navigator.hardwareConcurrency and SW/WW execution profile. Not possible to limit/bump the `ServiceWorker`/`WebWorker` thread limit via existng Puppeteer APIs.
* ❌ **WebGL extensions profiling** - desc. tbd
* ❌ **RTCPeerConnection when behind a proxy** - Applies to both SOCKS and HTTP(S) proxies.
* ❌ **Performance.now** - desc. tbd (red pill)
* ❌ **WebGL profiling** - desc. tbd
* ❌ **Behavior Detection** - desc. tbd (events, params, ML+AI buzz)
* ❌ **Font fingerprinting** - desc. tbd (list+version+renderer via HTML&canvas)
* ❌ **Network Latency** - desc. tbd (integrity check: proxy det., JS networkinfo, dns resolv profiling&timing)
* ❌ **Battery API** - desc. tbd 
* ❌ **Gyroscope and other (mostly mobile) device sensors** - desc. tbd 

## [Multilogin](https://multilogin.com), [Kameleo](https://kameleo.io/) and others 💰🤠

* 🤷 **Font masking** - Font fingerprinting still leaks host OS due to use of [different font rendering backends on Win/Lin/Mac](https://blog.typekit.com/2010/10/15/type-rendering-operating-systems/). However, the basic "font whitelisting" technique can help to slightly rotate browser fingerprint.
* ❌ **Inconsistencies** - Profile misconfiguration leads to early property/behavior inconsitency detection.
* ❌ **Native extensions** - Unlike `puppeteer-extra-plugin-stealth` custom Chromium builds such as ML and Kameleo provide at most an override for native plugins and extensions shipped with Google Chrome.
* ❌ **AudioContext APIs and WebGL property override** - Manipulation of original canvas and audio waveform can be detected with custom JS.

tbd (if you have an active subscription in any of these services and don't mind sharing an account drop me an email ❤️) 

## Support 

If you have problems with scraping specific website, write me a short email at `dniespodziany@gmail.com`. Let's have a quick tête-à-tête consultation via Skype 😊.

Have I mentioned a ⭐ would be appreciated? :-) 

➡️ Ethereum address `0x380a4b41fB5e0e1EB8c616eBD56f62f8F934Bab6`
