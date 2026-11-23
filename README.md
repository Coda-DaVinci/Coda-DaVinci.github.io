# Coda-DaVinci project page

Static project homepage with ten real experiment video comparisons, corresponding proxies, paper figures, and the main benchmark table.

## Preview

Install `RangeHTTPServer` with `python3 -m pip install RangeHTTPServer`, then run `python3 -m RangeHTTPServer --bind 127.0.0.1 8080` from this directory and open `http://localhost:8080`. This serves byte-range requests for video seeking.

## Publish to GitHub Pages

Push this directory to `https://github.com/Coda-DaVinci/Coda-DaVinci.github.io` on the `main` branch. In **Settings → Pages**, select **Deploy from a branch**, `main`, and `/ (root)`.

## Update

- `index.html`: paper metadata, text, benchmark results, and embedded case metadata.
- `app.js`: synchronized comparison playback, proxy switching, figure zoom, and citation copying.
- `styles.css`: desktop and mobile styles.
- `assets/`: compressed publication figures, real generated videos, proxies, and poster frames.
- `assets/main-results.png`: the main results table captured from the paper; the Results links jump to this figure.
- `cases.json`: case prompts and media paths, also embedded into `index.html` for local viewing.

The Paper link opens https://arxiv.org/abs/2611.26595. The Code link follows the paper's existing repository URL.

Long-video examples include the complete concatenated sequences from LongAV-Compass T2AV_039 (88 seconds) and WBench_92 (20 seconds), comparing Seedance direct generation with Coda-DaVinci.
