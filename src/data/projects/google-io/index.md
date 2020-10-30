---
category: "projects"
order: 1
cover: "./cover-2019.jpg"
title: "Google I/O Web App"
description: "I was an engineer and eventually the technical lead for the annual Google developer conference web application over the span of three years."
description_long: "I was an engineer and eventually the technical lead for the annual Google developer conference web application over the span of three years. This app provided attendees and livestream viewers information about the event, the ability to create their own schedule, an interactive map, and a livestream. Our team was embedded within Google and we worked with the agency Instrument who created the branding and design for these years."
url: https://events.google.com/io
date: "2018-2020"
tags: ["Preact", "Tech Lead", "Work"]
clients: ["Left Field Labs", "Google"]
published: true
featured: true
---

## 2018

In 2018, we had a hybrid website, where it was partially created with [Grow](//grow.io), a static-site generator, and the more interactive application was created with Preact and MobX.

Though the live site is no longer active, you can [see the recap of I/O 2018 here](https://events.google.com/io2018/).

## 2019

In 2019, I helped re-architect and re-build our application from the previous year by initially presenting a prototype to my team, getting feedback, and then collaborating with the two other developers on the project on the rest.

### Personal accomplishments

- Helped re-architect, re-build, and streamline our application from the year before. Instead of using two different repositories and two separate applications, we combined them into one repository, removing Grow and using Preact throughout.
- Implemented server-side rendering. Not only did this improve performance, but it drastically improved SEO, particularly for dynamically generated routes like individual sessions.
- Created a design grid system using CSS Grid.
- Restructured a MobX implementation to separate data-updates and UI updates. This allowed us to have a root store for high-level UI, which was useful particularly for global styles (i.e. check if a modal is visible).
- Developed a component library using Storybook.

## 2020

Though 2020's I/O was eventually cancelled due to the pandemic, my team and I updated the previous year's site with a new design and created [a teaser game for the Internet to solve](/projects/google-io-collaboration-of-the-cosmos).

I was the technical lead this year, and I helped work with a team of three other developers to update our previous repository and think through potential new features.
