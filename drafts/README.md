# PandaHat / Research in public

A static portfolio for a student-led machine learning research group in UPRM Computer Science. The current iteration is an editorial research index instead of a single scrolling landing page.

## Views

- `#home` introduces the group and points visitors to the work.
- `#work` lists research tracks with Vision, Robustness, and Systems filters. Select a row to open its methods and summary.
- `#lab` makes the group’s research principles and working beliefs visible.
- `#people` contains the editable team roster and contact point.
- `motion.html` is a standalone motion study gallery based on the supplied research drafts. It lets you compare animation ideas before promoting one into the main experience.

## Editing content

- `app.js` contains the `projects` and `members` data arrays.
- `index.html` contains the view structure and editorial copy.
- `styles.css` contains the Fieldnotes default theme, Signal alternate theme, and responsive layout.
- `assets/` contains the local imagery used by the index and project detail view.
- Imported evidence figures include the NDVI matrix, vegetation tiles, and adversarial-example comparison from the supplied PandaHat draft package.

## Run locally

```bash
python3 -m http.server 8080 --directory .
```
Then open `http://localhost:8080`.
