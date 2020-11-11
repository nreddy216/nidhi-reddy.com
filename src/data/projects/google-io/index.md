---
category: "projects"
order: 1
cover: "./cover-2019.jpg"
title: "Google I/O Web App"
description: "I was an engineer and eventually the technical lead for the annual Google developer conference web application over the span of three years."
description_long: "I was an engineer and eventually the technical lead for the annual Google developer conference web application over the span of three years. This app provided attendees and livestream viewers information about the event, the ability to create their own schedule, an interactive map, and a livestream."
url: https://events.google.com/io
url_text: See limited site
date: "2018-2020"
tags: ["Development", "Tech Lead", "Work"]
clients: ["Left Field Labs", "Google"]
published: true
featured: true
scripts:
  [
    {
      src: "https://platform.twitter.com/widgets.js",
      async: true,
      charset: "utf-8",
    },
    { src: "https://player.vimeo.com/api/player.js" },
  ]
---

## Overview

I worked at [Left Field Labs](//leftfieldlabs.com), where I was embedded within a larger team at Google. Our largest event of the year was Google's developer conference, which attracts hundreds of thousands of people in the tech industry annually.

## Features

Below are just some of the main features of the apps over the years.

<div class="iframe-video" style="padding:61.94% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/477785483?autoplay=1&loop=1&title=0&byline=0&portrait=0&mute=1" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay;" allowfullscreen></iframe></div>

- Progressive Web App created with Preact
- Pre-rendering or Server-side rendering for better indexing and performance
- Schedule with session reservations, bookmarks, and feedback surveys
- Video player with fullscreen, picture-in-picture options, and additional information overlays
- Time-picker for testing purposes
<div class="iframe-video" style="padding:62.34% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/477785412?autoplay=1&loop=1&title=0&byline=0&portrait=0&mute=1" style="position:absolute;top:0;left:0;width:100%;height:100%;margin-top:-1px;" frameborder="0" allow="autoplay;" allowfullscreen></iframe></div>
- Scheduled and toggle-able updates to the UI during the days of the conference
- Dynamic, deep-linked modals for both sessions and speakers
<div class="iframe-video" style="padding:62.34% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/477785477?autoplay=1&loop=1&title=0&byline=0&portrait=0&mute=1" style="position:absolute;top:0;left:0;width:100%;height:100%;transform:scale(1.1);" frameborder="0" allow="autoplay;" allowfullscreen></iframe></div>
- Interactive, custom-designed map
<div class="iframe-video" style="padding:55.34% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/477694428?autoplay=1&loop=1&title=0&byline=0&portrait=0&mute=1" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay;" allowfullscreen></iframe></div>
- Live feed
- Live, interactive schedule
- Marketing pages with unique branding elements (masked images, SVG animations)
- Component library using Storybook

**2018**

This was the first year my team, which was embedded inside the Creative Engineering department at Google, worked on the Google I/O app. Due to time restraints and our team inheriting the work of two separate teams, we ended up having a hybrid website, where half of it was created with [Grow](//grow.io), a static-site generator, and the more interactive, livestream half of the application was created with Preact and MobX.

Though the live site is no longer active, you can [see the recap of I/O 2018 here](https://events.google.com/io2018/).

**2019**

For the 2019 app, we knew we had many improvements ahead of us since the previous architecture wasn't sustainable. Because of this, I helped re-architect and re-build our application from the previous year by initially presenting a prototype to my team, getting feedback, and then collaborating with the two other developers on the project on the rest.
<br><br>
Personal accomplishments

- Helped re-architect, re-build, and streamline our application from the year before. Instead of using two different repositories and two separate applications, we combined them into one repository, removing Grow and using Preact throughout.
- Implemented server-side rendering. Not only did this improve performance, but it drastically improved SEO, particularly for dynamically generated routes like individual sessions.
- Created a design grid system using CSS Grid.
- Restructured a MobX implementation to separate data-updates and UI updates. This allowed us to have a root store for high-level UI, which was useful particularly for global styles (i.e. check if a modal is visible).
- Implemented a component library using Storybook.

For more info, [see the recap site](//events.google.com/io2019)

**2020**

Though 2020's I/O was eventually cancelled due to the pandemic, my team and I updated the previous year's site with a [new design](//events.google.com/io) and created [a teaser game for the Internet to solve](/projects/google-io-collaboration-of-the-cosmos).

I was the technical lead this year, and I helped work with a team of three other developers to update our previous app, improve web performance and accessibility, and think through the architecture for new features.

## Credits

I've been able to worked with many talented, hard-working people on this large project over the years. Below is a list of all of my teammates who collaborated with me.
<br><br>

**2018-2019**

- Development: [Left Field Labs](//leftfieldlabs.com)
  - Developers: Fernando Guerrero, Steve Geer
  - Producers: Magali Devic, Shauna Lacoste
  - QA: Carolina Machado
- Design: [Instrument](//www.instrument.com/)
- Google Developer Marketing Team, headed by Monica Bagagem and Kerry Murrill

**2020**

- Development: [Left Field Labs](//leftfieldlabs.com)
  - Developers: Keren Megory-Cohen, Matt Masurka, Mikey Wagner
  - Producer: Elisha Kersey
  - QA: Altheria Weaver, C.J. Quick
- Design: [Instrument](//www.instrument.com/)
- Google Developer Marketing Team, headed by Kerry Murrill
