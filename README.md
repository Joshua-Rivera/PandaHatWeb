# PandaHat — Fieldnotes × Signal v2

A standalone static prototype focused on the scroll interaction shown in the provided reference.

## Main change
The opening section now behaves like a sticky editorial collage:

1. Research visuals begin stacked tightly around the PandaHat wordmark.
2. Scrolling spreads each card into a wider research field.
3. The PandaHat wordmark fades into **“Adversarial by nature.”**
4. The page then continues into research questions, members, and process.

The collage uses only local assets, CSS-rendered research visuals, and vanilla JavaScript—no animation dependency is required.

## Editing content
- `app.js` → `questions` array for research questions.
- `app.js` → `members` array for member cards.
- `index.html` → collage cards if you want to replace any conceptual card with a real project image.
- `styles.css` → `data-theme="fieldnotes"` is the default; the Signal theme is activated by the switch in the header.

## Replace a collage visual with a real image
Use this structure inside any `.collage-card`:

```html
<figure class="collage-card ..." ...>
  <img src="assets/your-project-image.jpg" alt="Description" />
  <figcaption>Short label</figcaption>
</figure>
```

The scroll animation will continue to work because positioning is controlled by the card's `data-sx`, `data-sy`, `data-ex`, `data-ey`, and rotation values.

## Run locally
```bash
python3 -m http.server 8080 --directory .
```
Then open `http://localhost:8080`.

This prototype does not modify the adversarial research repository.
