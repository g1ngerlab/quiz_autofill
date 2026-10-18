// ==UserScript==
// @name         Quiz Autofill
// @match        default set to *://*/mod/quiz/attempt.php*
// @grant        none
// ==/UserScript==

(() => {
    const KEY = 'quiz_autofill_answers';
    const POS_KEY = 'quiz_autofill_pos';

    // Build the floating control panel and add it to the page
    const box = document.createElement('div');
    box.style = 'position:fixed;top:10px;right:10px;z-index:99999;background:#fff;border:2px solid #333;font:13px sans-serif';
    box.innerHTML = `
    <div id="qa-header" style="display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;touch-action:none;padding:12px 8px;background:#eee">
      <b></b>
      <button id="qa-toggle">-</button>
    </div>
    <div id="qa-body" style="padding:8px;border-top:1px solid #333">
      <textarea rows="12" cols="30" placeholder="one answer per line"></textarea><br>
      <button id="qa-fill">Fill</button>
      <button id="qa-clear">Clear</button>
      <button id="qa-delete">Delete</button>
    </div>`;
    document.body.appendChild(box);

    // Move the panel to (x, y), keeping it fully inside the viewport
    const moveTo = (x, y) => {
        const maxX = window.innerWidth - box.offsetWidth;
        const maxY = window.innerHeight - box.offsetHeight;
        box.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        box.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        box.style.right = 'auto';
    };

    // Restore the last saved panel position
    try {
        const pos = JSON.parse(localStorage.getItem(POS_KEY));
        if (pos) moveTo(pos.x, pos.y);
    } catch (e) {}

    // Drag: move the panel by dragging its header, then save the new position
    const header = box.querySelector('#qa-header');
    let dragX = 0, dragY = 0, dragging = false;
    header.onpointerdown = e => {
        if (e.button !== 0 || e.target.closest('button')) return;
        const r = box.getBoundingClientRect();
        dragX = e.clientX - r.left;
        dragY = e.clientY - r.top;
        dragging = true;
        header.setPointerCapture(e.pointerId);
    };
    header.onpointermove = e => {
        if (dragging) moveTo(e.clientX - dragX, e.clientY - dragY);
    };
    header.onpointerup = header.onpointercancel = () => {
        if (!dragging) return;
        dragging = false;
        const r = box.getBoundingClientRect();
        try { localStorage.setItem(POS_KEY, JSON.stringify({ x: r.left, y: r.top })); } catch (e) {}
    };

    // Re-clamp the panel to its current position (e.g. after a resize or expanding it)
    const keepOnScreen = () => {
        const r = box.getBoundingClientRect();
        moveTo(r.left, r.top);
    };
    window.addEventListener('resize', keepOnScreen);

    // Restore saved answers into the textarea and save them on every edit
    const ta = box.querySelector('textarea');
    try { ta.value = localStorage.getItem(KEY) || ''; } catch (e) {}
    ta.oninput = () => { try { localStorage.setItem(KEY, ta.value); } catch (e) {} };

    // Toggle: show/hide the panel body
    box.querySelector('#qa-toggle').onclick = () => {
        const b = box.querySelector('#qa-body');
        b.style.display = b.style.display === 'none' ? '' : 'none';
        keepOnScreen();
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
