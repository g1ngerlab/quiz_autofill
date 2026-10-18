// ==UserScript==
// @name         Quiz Autofill
// @match        default set to *://*/mod/quiz/attempt.php*
// @grant        none
// ==/UserScript==

(() => {
    const KEY = 'quiz_autofill_answers';

    // Build the floating control panel and add it to the page
    const box = document.createElement('div');
    box.style = 'position:fixed;top:10px;right:10px;z-index:99999;background:#fff;border:2px solid #333;padding:8px;font:13px sans-serif';
    box.innerHTML = `
    <button id="qa-toggle" style="float:right">-</button>
    <div id="qa-body">
      <textarea rows="12" cols="30" placeholder="one answer per line"></textarea><br>
      <button id="qa-fill">Fill</button>
      <button id="qa-clear">Clear</button>
      <button id="qa-delete">Delete</button>
    </div>`;
    document.body.appendChild(box);

    // Restore saved answers into the textarea and save them on every edit
    const ta = box.querySelector('textarea');
    try { ta.value = localStorage.getItem(KEY) || ''; } catch (e) {}
    ta.oninput = () => { try { localStorage.setItem(KEY, ta.value); } catch (e) {} };

    // Toggle: show/hide the panel body
    box.querySelector('#qa-toggle').onclick = () => {
        const b = box.querySelector('#qa-body');
        b.style.display = b.style.display === 'none' ? '' : 'none';
    };

    // Clear: empty the textarea (and the saved answers)
    box.querySelector('#qa-clear').onclick = () => { ta.value = ''; ta.oninput(); };

    // Delete: empty all text answer fields in the quiz
    box.querySelector('#qa-delete').onclick = () => {
        document.querySelectorAll('.que input[type="text"]').forEach(f => {
            if (!f.value) return;
            f.value = '';
            f.dispatchEvent(new Event('input', { bubbles: true }));
            f.dispatchEvent(new Event('change', { bubbles: true }));
        });
    };

    // Fill: put each textarea line into the quiz text fields, in order
    box.querySelector('#qa-fill').onclick = () => {
        const answers = ta.value.split('\n').map(s => s.trim()).filter(Boolean);
        const fields = [...document.querySelectorAll('.que input[type="text"]')];
        fields.forEach((f, i) => {
            if (answers[i] === undefined) return;
            f.value = answers[i];
            f.dispatchEvent(new Event('input', { bubbles: true }));
            f.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }
})();
