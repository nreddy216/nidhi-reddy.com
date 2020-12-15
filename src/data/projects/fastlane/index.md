---
category: "projects"
order: 4
cover: "./fastlane-cover.png"
image_style: "& .gatsby-image-wrapper { margin-top: -27px; }"
video_id: "475576068"
video_title: "Fastlane animated hero banner"
title: "Fastlane"
description: "A website for an open source platform aimed at simplifying Android and iOS deployment."
description_long: "My team and I developed a website for Fastlane, an open source platform aimed at simplifying Android and iOS deployment. In addition, I contributed to the motion design of the hero.<br><br> Technologies used include: Grow, HTML, SASS, and vanilla Javascript. "
date: "2019"
url: https://fastlane.tools
tags: ["Development", "Motion Design", "Work"]
published: true
featured: true
vimeo_embed: true
---

## Overview

For this site, the main challenge was the animations. We weren't necessarily provided a mock for the motion of the hero banner (with flying dots and triangles), so as an amateur animator, I was happy to take on the task of figuring out its motion design. I also prototyped this banner in a variety of technologies, from WebGL to GSAP to AfterEffects, since this was honestly just a fun task to do.

Below is one animation test that I thought was an interesting concept, where the circle particles were lights that illuminated the triangles. Ultimately, this wasn't the right feel for the flat design of the site.

<div class="iframe-video" style="padding:35.34% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/477868700?autoplay=1&loop=1&title=0&byline=0&portrait=0&mute=1" style="position:absolute;top:0;left:0;width:100%;height:100%;transform:scale(1.05);background:#090847;" frameborder="0" allow="autoplay;" allowfullscreen></iframe></div>

For the final hero, I used a combination of [GSAP](https://greensock.com/gsap/) to choregraph the triangle mesh animations and [Particles.js](https://vincentgarreau.com/particles.js/) for the interactive circle particles.

Beyond these elements, I worked on several other sections including the navigation and carousel component.

![Fastlane screenshot](./fastlane-screenshot.jpg)
