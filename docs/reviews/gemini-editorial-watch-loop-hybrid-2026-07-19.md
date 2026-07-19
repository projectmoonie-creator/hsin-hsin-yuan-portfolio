### Finding 1: Press Preview Card Layout Collapse on Image Load Failure
* **Severity**: High
* **Evidence**: `en/index.html` (lines 195, 204, 234, 243, 252) and `zh/index.html` (lines 195, 204, 234, 243, 252) — `onerror="this.parentElement.remove()"` on the `<img>` elements inside `.press-preview-card`.
* **User-Visible Impact**: If any external press image fails to load (due to network issues, ad-blockers, or broken external URLs), the `onerror` handler removes the `.press-preview-image` container. Because `.press-preview-card` is defined as a CSS Grid with a fixed column layout (`grid-template-columns: 4rem minmax(0, 1fr)` in `styles.css`), the remaining text container (`.press-preview-copy`) is forced into the first `4rem` (64px) column. This squishes the text into an unreadable vertical column of single characters, completely breaking the card's layout.
* **Fix Direction**: Instead of removing the image container, hide only the image or dynamically update the grid columns when the image is missing. For example:
  ```html
  onerror="this.closest('.press-preview-card').style.gridTemplateColumns='1fr'; this.parentElement.remove();"
  ```

---

### Finding 2: Watch Loop Viewport Scroll Conflict on Desktop
* **Severity**: Medium
* **Evidence**: `styles.css` (line 311) — `.watch-loop-viewport` selector; `watch-loop.js` (line 198) — `enable()` function.
* **User-Visible Impact**: On desktop viewports where the automatic infinite scroll animation is active, `.watch-loop-viewport` retains `overflow-x: auto` from the base styles. If a user performs a horizontal swipe gesture (e.g., on a trackpad) or uses shift+scroll, the viewport scrolls manually. This changes the viewport's `scrollLeft` to a non-zero value, which directly conflicts with the JavaScript-driven `translate3d` animation on the track. This causes the loop to jitter, jump, or reveal large empty gaps where the cloned sequences fail to align correctly.
* **Fix Direction**: Dynamically disable manual horizontal overflow when the infinite loop is active. In `watch-loop.js`, set the viewport's overflow style to `hidden` when enabled, and restore it to `auto` when disabled:
  ```javascript
  // In enable()
  viewport.style.overflowX = "hidden";

  // In disable()
  viewport.style.overflowX = "auto";
  ```