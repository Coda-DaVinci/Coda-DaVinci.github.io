# Coda-DaVinci project page

Static project homepage with real experiment videos, proxy comparisons, paper figures, and the main benchmark table.

## Preview

Run `python3 -m http.server 8080` from this directory, then open `http://localhost:8080`.

## Publish to GitHub Pages

Push this directory to the homepage repository's `main` branch. In **Settings → Pages**, select **Deploy from a branch**, `main`, and `/ (root)`.

## Update

- `index.html`: paper metadata, text, benchmark results, and embedded case metadata.
- `app.js`: synchronized comparison playback, proxy switching, figure zoom, and citation copying.
- `styles.css`: desktop and mobile styles.
- `assets/`: compressed publication figures, real generated videos, proxies, and poster frames.
- `results.csv`: main-table values from the paper.
- `cases.json`: case prompts and media paths, also embedded into `index.html` for local viewing.

The paper resource is marked forthcoming until its public URL is available. The Code link follows the paper's existing repository URL.
