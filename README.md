# Birthday Surprise Website

This is a static birthday website personalized for Parmod Das on September 22, 2026. It can be opened locally or published with any static host.

## Personalize

Edit `config.js`:

- `friendName`: your friend's name
- `fromName`: your name
- `birthdayDate`: the birthday date and time
- `giftItems`: the surprise gift wishes that appear after the gift box opens
- `memories`: short personal moments
- `reasons`: quick reasons they are special
- `photos`: image paths and captions

To add photos, put files in `assets/photos/` and use paths like:

```js
photos: [
  { src: "assets/photos/photo-1.jpg", caption: "The best day" }
]
```

## Publish Publicly

Fastest option: drag the whole `birthday-surprise` folder onto Netlify Drop.

Other good options:

- GitHub Pages: upload these files to a repository and enable Pages.
- Vercel: import the folder or repo as a static site.
- Cloudflare Pages: connect a repo and publish from the root.

The main file is `index.html`.
