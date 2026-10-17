# Quiz Autofill

A small browser extension for Chromium-based browsers (Chrome, Edge, Brave, Opera, Vivaldi) that fills the text-answer fields of a **Moodle quiz** from a list you paste in, one answer per line.

It adds a floating panel to quiz attempt pages. You paste your answers, click **Fill**, and each answer goes into the matching text field, in order from top to bottom.

---

## Table of contents

- [Features](#features)
- [1. Download the project](#1-download-the-project)
- [2. Add the extension to Chrome](#2-add-the-extension-to-chrome)
- [3. How to use it](#3-how-to-use-it)
- [Updating the extension](#updating-the-extension)
- [Using it on other sites](#using-it-on-other-sites)
- [Troubleshooting](#troubleshooting)
- [Removing the extension](#removing-the-extension)
- [License](#license)

---

## Features

- Floating panel in the top-right corner of every Moodle quiz attempt page
- Paste answers one per line, then fill every text field with one click
- Your answer list is saved automatically and is still there after a reload or on the next quiz page
- **Clear** button to empty the list
- **Delete** button to erase every filled-in answer from the text fields on the page
- **−** button to collapse the panel so it stays out of the way
- Fires the page's `input` and `change` events, so Moodle registers the values as if you typed them
- No permissions requested, no network access, no tracking. Everything stays in your browser.

## 1. Download the project

Pick **one** of these options.

### Option A: Download as a ZIP (no tools needed)

1. Open the repository: <https://github.com/g1ngerlab/quiz_autofill>
2. Click the green **Code** button.
3. Click **Download ZIP**.
4. Find `quiz_autofill-main.zip` in your Downloads folder and extract it:
   - **Windows:** right-click the file, choose **Extract All…**, then **Extract**.
   - **macOS:** double-click the file.
   - **Linux:** `unzip quiz_autofill-main.zip`
5. Move the extracted folder somewhere permanent, for example `Documents/quiz_autofill`.

> **Important:** Chrome loads the extension straight from this folder. If you delete or move the folder later, the extension stops working. Don't leave it in a temporary location.

### Option B: Clone with Git

If you have [Git](https://git-scm.com/downloads) installed:

```bash
git clone https://github.com/g1ngerlab/quiz_autofill.git
cd quiz_autofill
```

With Git, updating later is easier (see [Updating the extension](#updating-the-extension)).

---

## 2. Add the extension to Chrome

Extensions that aren't from the Chrome Web Store have to be loaded as **unpacked** extensions in Developer mode.

1. Open Chrome and go to:
   ```
   chrome://extensions
   ```
   You can also use the **⋮** menu, then **Extensions**, then **Manage Extensions**.
2. Turn on **Developer mode** with the toggle in the **top-right corner**.
3. Click **Load unpacked**, which appears at the top-left.
4. In the folder picker, open the project folder and select the **`chromium`** folder, the one that directly contains `manifest.json`. Then click **Select Folder**.
   ```
   quiz_autofill/chromium   ← select this one
   ```
5. **Quiz Autofill** now appears in your extensions list. Make sure its toggle is **on**.
6. Optional: click the puzzle-piece icon in the toolbar and pin the extension. It has no popup, so pinning only makes it easier to see that it's installed.

### Other Chromium browsers

The steps are the same. Only the address of the extensions page changes:

| Browser | Extensions page | Notes |
|---|---|---|
| Chrome | `chrome://extensions` | Developer mode toggle is top-right |
| Microsoft Edge | `edge://extensions` | Developer mode toggle is in the left sidebar |
| Brave | `brave://extensions` | Same as Chrome |
| Opera | `opera://extensions` | Developer mode toggle is top-right |
| Vivaldi | `vivaldi://extensions` | Same as Chrome |

> **Note:** On startup, Chrome may show a banner such as *"Disable developer mode extensions"*. This is normal for unpacked extensions. Click **✕** or **Keep** to dismiss it. Don't click **Disable**.

---

## 3. How to use it

1. Log in to your Moodle site and start or continue a quiz attempt. The URL should contain `/mod/quiz/attempt.php`.
2. The **Quiz Autofill** panel appears in the top-right corner of the page.
3. Paste or type your answers into the text box, **one answer per line**, in the same order as the text fields on the page:
   ```
   42
   Paris
   photosynthesis
   3.14
   ```
4. Click **Fill**. Each line goes into the next text field on the page:
   - line 1 → first text field
   - line 2 → second text field
   - and so on
5. Check the answers, then use Moodle's own **Next page** or **Finish attempt** buttons as usual.

### Panel buttons

| Button | What it does |
|---|---|
| **Fill** | Fills the text fields on the current page with your list |
| **Clear** | Empties the answer list, including the saved copy |
| **Delete** | Erases the answers from every text field on the current page that has something in it. Your answer list in the panel is kept. |
| **−** | Collapses or expands the panel |

### Good to know

- **Blank lines are ignored.** You can't leave an empty line to skip a field, because the next answer moves up into its place. Every field you want filled needs its own non-empty line.
- **Only text fields count.** Multiple-choice and other non-text questions are skipped and don't use up a line.
- **Multi-page quizzes:** **Fill** always starts again from line 1 on each page. If your quiz has several pages, put only the current page's answers in the box, or click **Clear** and paste the next set before each page.
- **Extra lines** (more lines than fields) are ignored. **Missing lines** (fewer lines than fields) leave the remaining fields as they are.
- Your list is saved as you type and is still there after a page reload.

---

## Updating the extension

1. Get the new files:
   - **ZIP:** download the ZIP again and replace the contents of your existing folder. Keep the same folder location.
   - **Git:** run `git pull` inside the project folder.
2. Go to `chrome://extensions`.
3. Click the **↻ reload** icon on the **Quiz Autofill** card.
4. Reload any open quiz tabs.

## Using it on other sites

By default, the extension only runs on Moodle quiz attempt pages. If your quiz uses a different URL, edit `matches` in `chromium/manifest.json`:

```json
"matches": ["*://*/mod/quiz/attempt.php*", "https://your-site.example.com/some/path/*"]
```

Then click **↻ reload** on the extension card in `chrome://extensions`.

The script looks for text inputs inside elements with the `.que` class, which is Moodle's question container. On a site that isn't Moodle, change the selector in `chromium/content.js` as well:

```js
const fields = [...document.querySelectorAll('.que input[type="text"]')];
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| **"Manifest file is missing or unreadable"** when loading | You selected the wrong folder. Select `chromium`, the folder that directly contains `manifest.json`, not the outer `quiz_autofill` folder. |
| **The panel doesn't appear** | Check that the URL contains `/mod/quiz/attempt.php`. Check that the extension is enabled in `chrome://extensions`. Reload the page. |
| **There's an "Errors" button on the extension card** | Click it to see the details. Then click **↻ reload** on the card, and remove and load the extension again if the error doesn't go away. |
| **Fill does nothing** | The questions on this page may not be text-input questions (for example multiple choice or essay). Or the answer box may be empty. |
| **Answers land in the wrong fields** | Check the order of your lines, and check for missing answers. Remember that blank lines are skipped. |
| **The extension disappeared after a restart** | The project folder was moved or deleted. Put it back, or load it again from its new location. |
| **My saved list is gone** | The list is stored per site in the page's `localStorage`. Clearing browsing data, using Incognito, or opening a different Moodle domain gives you an empty list. |

Developer tip: to see errors from the content script, open the quiz page, press **F12**, and check the **Console** tab.

---

## Removing the extension

1. Go to `chrome://extensions`.
2. Click **Remove** on the **Quiz Autofill** card.
3. Optional: delete the project folder.

---

## License

[MIT](LICENSE) © 2026 Aleksandr Muskevits
