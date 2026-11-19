# Coda-DaVinci project page

Static project homepage with real experiment videos, proxy comparisons, paper figures, and the main benchmark table.

## Preview

Run `python3 -m http.server 8080` from this directory, then open `http://localhost:8080`.

## Publish to GitHub Pages

Push this directory to `https://github.com/Coda-DaVinci/Coda-DaVinci.github.io` on the `main` branch. In **Settings → Pages**, select **Deploy from a branch**, `main`, and `/ (root)`.

## Update

- `index.html`: paper metadata, text, benchmark results, and embedded case metadata.
- `app.js`: synchronized comparison playback, proxy switching, figure zoom, and citation copying.
- `styles.css`: desktop and mobile styles.
- `assets/`: compressed publication figures, real generated videos, proxies, and poster frames.
- `assets/main-results.png`: the main results table captured from the paper; the Results links jump to this figure.
- `cases.json`: case prompts and media paths, also embedded into `index.html` for local viewing.

The paper resource is marked forthcoming until its public URL is available. The Code link follows the paper's existing repository URL.
