# DakSevaInfo – Branch & Folder Guide

## Mapping

| Folder            | Branch           | Purpose                          |
|-------------------|------------------|----------------------------------|
| `postalBackend`   | `postalBackend`  | Backend-only work                |
| `postalWebapp`    | `postalWebapp`   | Web app–only work                |
| `postalMobileapp` | `postalMobileapp`| Mobile app–only work             |
| **All three**     | `main`           | Combined project; default branch |

---

## How it works

- **`main`**  
  - Contains all three folders: `postalBackend`, `postalWebapp`, `postalMobileapp`.  
  - This is the single “combined” branch. All finished work from the other branches should end up here.

- **`postalBackend` / `postalWebapp` / `postalMobileapp`**  
  - Use when you are working only on that part of the project.  
  - The repo still has all three folders on these branches; you just focus changes in one folder and merge that branch into `main` when done.

---

## Daily workflow

### 1. Work on backend

```bash
git checkout main
git pull
git checkout postalBackend
# Optional: merge latest main into your branch
git merge main

# Do your work only in postalBackend/
# Then commit and push

git add postalBackend/
git commit -m "Backend: your message"
git push origin postalBackend
```

When ready to bring backend changes into the full project:

```bash
git checkout main
git merge postalBackend
git push origin main
```

### 2. Work on web app

```bash
git checkout main
git pull
git checkout postalWebapp
git merge main   # optional

# Work only in postalWebapp/
git add postalWebapp/
git commit -m "Webapp: your message"
git push origin postalWebapp
```

Merge into main when done:

```bash
git checkout main
git merge postalWebapp
git push origin main
```

### 3. Work on mobile app

Same idea as above, but use branch `postalMobileapp` and folder `postalMobileapp/`.

---

## .gitignore

- **Root:** `.gitignore` at repo root ignores common junk (e.g. `.DS_Store`, `.env`).
- **Per folder:** Each project has its own `.gitignore`:
  - `postalBackend/.gitignore` – e.g. `node_modules/`, `.env`, logs, build output.
  - `postalWebapp/.gitignore` – same kind of ignores for the web app.
  - `postalMobileapp/.gitignore` – same for the mobile app (including React Native / Expo if you use them).

So: **don’t push `node_modules` or env files**; they’re already ignored in each folder and at root.

---

## Quick reference

| You want to…              | Do this |
|---------------------------|--------|
| See the full project      | `git checkout main` |
| Work only on backend      | `git checkout postalBackend`, edit only `postalBackend/` |
| Work only on web app      | `git checkout postalWebapp`, edit only `postalWebapp/` |
| Work only on mobile app   | `git checkout postalMobileapp`, edit only `postalMobileapp/` |
| Put your work into main   | Merge your branch into `main` and push `main` |

---

## Summary

- **Folder ↔ branch:** Each folder has a matching branch; use that branch when you work only in that folder.
- **main:** Holds all three folders combined; merge feature branches here.
- **.gitignore:** Root + each folder; `node_modules` and env files are not pushed.
