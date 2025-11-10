# How to Host Your Privacy Policy

You have several options for hosting your privacy policy:

## Option 1: GitHub Pages (Recommended - Free & Easy)

1. **Create a `docs` folder** in your repository:
   ```bash
   mkdir docs
   cp privacy-policy.html docs/
   ```

2. **Commit and push to GitHub:**
   ```bash
   git add docs/privacy-policy.html
   git commit -m "Add privacy policy page"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **"Deploy from a branch"**
   - Select branch: **main**
   - Select folder: **/docs**
   - Click **Save**

4. **Your privacy policy URL will be:**
   ```
   https://ordervschaos.github.io/pinterest-fullscreen-chrome-plugin/privacy-policy.html
   ```

## Option 2: GitHub Raw File (Quick Alternative)

Use the raw GitHub file URL directly:
```
https://raw.githubusercontent.com/ordervschaos/pinterest-fullscreen-chrome-plugin/main/PRIVACY_POLICY.md
```

**Note:** This shows the markdown file, not the formatted HTML version.

## Option 3: Add to Repository Root

1. **Add files to repository:**
   ```bash
   git add privacy-policy.html PRIVACY_POLICY.md
   git commit -m "Add privacy policy"
   git push origin main
   ```

2. **Use GitHub Pages with root folder:**
   - Go to Settings → Pages
   - Select source: **main branch** → **/ (root)**
   - Your URL: `https://ordervschaos.github.io/pinterest-fullscreen-chrome-plugin/privacy-policy.html`

## Option 4: GitHub Gist (Simple Alternative)

1. Go to https://gist.github.com
2. Create a new public Gist
3. Name it `privacy-policy.md`
4. Paste the content from `PRIVACY_POLICY.md`
5. Click "Create public gist"
6. Copy the Gist URL and use it in Chrome Web Store

## Recommended: GitHub Pages

GitHub Pages is the best option because:
- ✅ Free hosting
- ✅ Professional URL
- ✅ Formatted HTML page (looks professional)
- ✅ Easy to update
- ✅ No additional setup needed

## After Hosting

Once you have your privacy policy URL, add it to:
1. Chrome Web Store → Privacy Practices tab → Privacy Policy URL field
2. Your extension's README.md (optional)

## Quick Setup Commands

```bash
# Create docs folder and copy privacy policy
mkdir -p docs
cp privacy-policy.html docs/

# Commit and push
git add docs/privacy-policy.html PRIVACY_POLICY.md
git commit -m "Add privacy policy for Chrome Web Store"
git push origin main

# Then enable GitHub Pages in repository settings
```

Your privacy policy URL will be ready in about 1-2 minutes after enabling GitHub Pages!

