# Solution Brand Visual Sources

This ledger records the official product sources selected for the 19 non-Cisco
Solution detail pages. Production assets are copied into the repository only
after the represented product and reuse suitability have been checked.

Retrieved: 2026-07-24

The exact direct URL for the original official-source output set is kept in
[`scripts/acquire-partner-visuals.sh`](../../scripts/acquire-partner-visuals.sh).
That manifest is executable and maps `partner slug | role | official asset URL`
one-to-one. All non-transparent sources are normalized locally to JPEG, quality
84, with a maximum long edge of 1600 px. Extreme Networks retains the official
PNG assets because their transparency is part of the supplied product artwork.

## Completed output matrix

| Partner | Local outputs | Official owner / source family |
|---|---|---|
| Extreme Networks | `extreme-networks/{hero,planning,deployment,operations}.png` | Extreme Networks Platform ONE and 4000 Series product media |
| Aruba | `aruba/{hero,planning,deployment,operations}.jpg` | Generated JOTO campaign visuals informed by HPE Aruba Networking Central, CX and access-point capabilities |
| Sangfor Network | `sangfor-network/{hero,planning,deployment,operations}.jpg` | Generated JOTO campaign visuals informed by Sangfor Secure SD-WAN and Central Manager capabilities |
| KnowBe4 | `knowbe4/{hero,planning,deployment,operations}.jpg` | KnowBe4 Human Risk Management and SAT product media |
| Palo Alto Networks | `palo-alto-networks/{hero,planning,deployment,operations}.jpg` | Palo Alto Networks NGFW and PA-Series product media |
| Fortinet | `fortinet/{hero,planning,deployment,operations}.jpg` | Fortinet FortiGate, FortiManager and Security Fabric media |
| Sangfor Security | `sangfor-security/{hero,planning,deployment,operations}.jpg` | Generated JOTO campaign visuals informed by Sangfor Athena NGFW and security operations capabilities |
| Check Point | `check-point/{hero,planning,deployment,operations}.jpg` | Generated JOTO campaign visuals informed by Check Point Infinity and Quantum capabilities |
| OneLogin | `onelogin/{hero,planning,deployment,operations}.jpg` | OneLogin identity platform product media |
| Dell Technologies | `dell-technologies/{hero,planning,deployment,operations}.jpg` | Dell Technologies official product demonstrations |
| Huawei | `huawei/{hero,planning,deployment,operations}.jpg` | Huawei OceanStor and all-flash data-center product media |
| Inspur | `inspur/{hero,planning,deployment,operations}.jpg` | Inspur compute and storage product media |
| AudioCodes | `audiocodes/{hero,planning,deployment,operations}.jpg` | AudioCodes Mediant SBC and management product media |
| Vodia | `vodia/{hero,planning,deployment,operations}.jpg` | Vodia V70 portal, dashboard and Teams integration media |
| CyberData | `cyberdata/{hero,planning,deployment,operations}.jpg` | CyberData SIP paging and intercom product media |
| InformaCast | `informacast/{hero,planning,deployment,operations}.jpg` | Singlewire InformaCast product and integration media |
| Verkada | `verkada/{hero,planning,deployment,operations}.jpg` | Verkada Command, cameras, access and workplace product media |
| Hikvision | `hikvision/{hero,planning,deployment,operations}.jpg` | Hikvision official channel product demonstrations |
| Keyking | `keyking/{hero,planning,deployment,operations}.jpg` | Keyking access-control product and interface media |

## Batch 1 — Network

| Partner / role | Represented product or capability | Official source | Review status |
|---|---|---|---|
| Extreme Networks / hero and operations | Extreme Platform ONE unified network workspace and multi-layer visualization | [Extreme Platform ONE](https://www.extremenetworks.com/platform-one) | Official product page verified; image candidates are being shortlisted |
| Extreme Networks / planning | Extreme fabric, access, RF, and service-layer topology | [Extreme Platform ONE workspace overview](https://www.extremenetworks.com/platform-one/product-tours/workspace-overview) | Official product tour verified; crop and embedded-text suitability under review |
| Extreme Networks / deployment | Extreme switching and wireless hardware managed by Platform ONE | [Extreme Platform ONE and expanded hardware portfolio](https://www.extremenetworks.com/resources/blogs/extreme-platform-one-and-our-expanded-hardware-portfolio) | Official portfolio page verified; hardware image candidate under review |
| Aruba / hero and operations | HPE Aruba Networking Central management, analytics, and device operations | [HPE Aruba Networking Central](https://www.hpe.com/us/en/aruba-central.html.html) | Official product page verified; dashboard/hero candidates are being shortlisted |
| Aruba / planning | Central campus, branch, wired, wireless, and SD-WAN architecture | [HPE Aruba Networking Central](https://www.hpe.com/us/en/aruba-central.html.html) | Official architecture claims verified; suitable diagram candidate under review |
| Aruba / deployment | HPE Aruba Networking CX switches and access points | [HPE Aruba Networking Access Points](https://www.hpe.com/us/en/aruba-access-points.html) | Official hardware page verified; CX/AP composition under review |
| Sangfor Network / hero and planning | Sangfor Secure SD-WAN high-level architecture | [Sangfor Secure SD-WAN](https://www.sangfor.com/cybersecurity/security-solutions/secure-sd-wan) | Official solution page verified; architecture image candidate identified |
| Sangfor Network / deployment | Athena NGFW branch device used as Secure SD-WAN CPE | [Sangfor Secure SD-WAN](https://www.sangfor.com/cybersecurity/security-solutions/secure-sd-wan) | Official component mapping verified; device image candidate identified |
| Sangfor Network / operations | Central Manager unified monitoring, policy, and reporting | [Sangfor Secure SD-WAN](https://www.sangfor.com/cybersecurity/security-solutions/secure-sd-wan) | Official component mapping verified; management visual under review |

## 2026-07-24 visual-quality replacement

Aruba, Sangfor Network, Sangfor Security and Check Point were regenerated with
OpenAI image generation after the first official-media pass failed the visual
quality review. Each route now uses four distinct, locally stored, 16:9 service
scenes for ecosystem, planning, deployment and operations. Prompts enforce the
shared JOTO deep-charcoal and emerald art direction, prohibit logos, words,
watermarks, video controls and screenshot-like compositions, and add restrained
vendor-specific color cues (Aruba orange, Sangfor blue/cyan, Check Point
magenta). Official product pages remain the capability reference; generated
images do not reproduce vendor interfaces or claim to be official product
photography.

## Review Rules

- The visual must show the named product, device family, interface, or solution
  architecture rather than a generic data-center photograph.
- Embedded interface text must remain legible after the desktop and mobile crop,
  or the candidate is rejected.
- Images with publication-only restrictions, watermarks, or unclear ownership
  are not copied into the production bundle.
- The final transform and local output path are added to this ledger when each
  source is accepted.
