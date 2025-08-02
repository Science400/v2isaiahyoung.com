---
title: "2025-08-01"
permalink: /garden/{{ title | slugify }}/index.html
description: "Captain's Log - 2025-08-01"
layout: lcars
gardenType: captainsLog
gardenStatus: evergreen
---

The other day, I remembered the CD of Peter and the Wolf and accompanying picture book I had as a kid. As I was trying to find it, I discovered the Wikipedia page for [Peter and the Wolf](https://en.wikipedia.org/wiki/Peter_and_the_Wolf) shows nearly 80 different recordings narrated by many people I recognized. 

I called my mom to see if she remembered which recording we had. When I told her how many recordings there were she said, "Oh no! Now I want to listen to them all." There wasn't an easy way to do that.

{% image "./src/garden/captainsLog2025-08-01/Screenshot 2025-08-01 at 18-56-52 Peter and the Wolf.png", "A screenshot of my Peter and the Wolf page.", "Peter and the Wolf" %}

My Sunday afternoon project turned into [Peter and the Wolf](/peter-wolf/). [Eleventy](https://www.11ty.dev/docs/) made it really easy to convert the table on the Wikipedia page to JSON and then build that table on my site. Then create a page for each recording. A quick search on YouTube found most, but not all, of the recordings and those links were added to the JSON. 

Next, I was pleased that I was able to use the Wikipedia API to grab an image and an excerpt for most of the narrators, orchestras, and conductors. It will be nice to figure out who was involved and read more if I want while I'm listening to the music.

{% image "./src/garden/captainsLog2025-08-01/Screenshot 2025-08-01 at 19-02-30 Peter and the Wolf.png", "A screenshot of my Peter and the Wolf page for Patrick Stewart's recording.", "Peter and the Wolf recording page" %}

Overall, I'm pretty pleased with how easy it was to put together this set of pages.