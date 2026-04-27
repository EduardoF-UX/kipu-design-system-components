#!/usr/bin/env python3
"""Prepend Kipu Small Button classes to <button> in index.html (static HTML only, before Babel)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
MARKER = '            <script type="text/babel">'

# Longer keys first — map semantic class token → kipu class string
_SPECS = {
    "med-recon-btn-reorder": "kipu-smbtn kipu-smbtn--filled",
    "med-recon-btn-cancel": "kipu-smbtn kipu-smbtn--outlined",
    "med-recon-close-btn": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "btn-confirm-nurse-review": "kipu-smbtn kipu-smbtn--filled",
    "discontinue-btn-submit": "kipu-smbtn kipu-smbtn--tonal",
    "discontinue-btn-all": "kipu-smbtn kipu-smbtn--tonal",
    "discontinue-btn-cancel": "kipu-smbtn kipu-smbtn--outlined",
    "discontinue-close-btn": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "apply-filters-btn": "kipu-smbtn kipu-smbtn--filled",
    "btn-submit-hold": "kipu-smbtn kipu-smbtn--filled",
    "btn-remove-instruction": "kipu-smbtn kipu-smbtn--tonal",
    "mar-warning-override-btn": "kipu-smbtn kipu-smbtn--filled",
    "mar-warning-wait-btn": "kipu-smbtn kipu-smbtn--outlined",
    "measurements-refresh-btn": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "add-new-criteria-btn": "kipu-smbtn kipu-smbtn--outlined",
    "add-criteria-row-btn": "kipu-smbtn kipu-smbtn--outlined",
    "add-criteria-btn": "kipu-smbtn kipu-smbtn--outlined",
    "add-shift-row-btn": "kipu-smbtn kipu-smbtn--outlined",
    "add-rule-btn": "kipu-smbtn kipu-smbtn--outlined",
    "remove-criteria-btn": "kipu-smbtn kipu-smbtn--tonal",
    "remove-shift-btn": "kipu-smbtn kipu-smbtn--tonal",
    "remove-row-btn": "kipu-smbtn kipu-smbtn--tonal",
    "rule-remove-btn": "kipu-smbtn kipu-smbtn--tonal",
    "btn-patient-signature": "kipu-smbtn kipu-smbtn--outlined",
    "btn-add-instruction": "kipu-smbtn kipu-smbtn--outlined",
    "btn-add-medication": "kipu-smbtn kipu-smbtn--outlined",
    "btn-add-action": "kipu-smbtn kipu-smbtn--outlined",
    "btn-cancel-review": "kipu-smbtn kipu-smbtn--outlined",
    "order-frequency-toggle": "kipu-smbtn kipu-smbtn--text",
    "clear-filters-btn": "kipu-smbtn kipu-smbtn--text",
    "btn-change-order": "kipu-smbtn kipu-smbtn--outlined",
    "filter-btn": "kipu-smbtn kipu-smbtn--outlined",
    "btn-hold-order": "kipu-smbtn kipu-smbtn--text",
    "btn-reorder": "kipu-smbtn kipu-smbtn--filled",
    "page-num": "kipu-smbtn kipu-smbtn--text kipu-smbtn--compact",
    "page-arrow": "kipu-smbtn kipu-smbtn--text kipu-smbtn--compact",
    "btn-edit-hold": "kipu-smbtn kipu-smbtn--outlined",
    "btn-stop-hold": "kipu-smbtn kipu-smbtn--tonal",
    "humalog-close": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "mar-warning-close": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "glucose-close": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "modal-close": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "close-btn": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "humalog-cancel": "kipu-smbtn kipu-smbtn--outlined",
    "glucose-cancel": "kipu-smbtn kipu-smbtn--outlined",
    "glucose-submit": "kipu-smbtn kipu-smbtn--filled",
    "humalog-save": "kipu-smbtn kipu-smbtn--filled",
    "btn-cancel": "kipu-smbtn kipu-smbtn--outlined",
    "btn-primary": "kipu-smbtn kipu-smbtn--filled",
    "btn-secondary": "kipu-smbtn kipu-smbtn--outlined",
    "btn-submit": "kipu-smbtn kipu-smbtn--filled",
    "dismiss-btn": "kipu-smbtn kipu-smbtn--text",
    "warning-btn": "kipu-smbtn kipu-smbtn--text",
    "medlog-nav-btn": "kipu-smbtn kipu-smbtn--text kipu-smbtn--compact",
    "bulk-action-btn": "kipu-smbtn kipu-smbtn--filled",
    "back-to-top-btn": "kipu-smbtn kipu-smbtn--elevated kipu-smbtn--icon",
    "btn-add-new": "kipu-smbtn kipu-smbtn--filled",
    "btn-verify": "kipu-smbtn kipu-smbtn--outlined",
    "btn-add-plus": "kipu-smbtn kipu-smbtn--outlined kipu-smbtn--icon",
    "btn-edit": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "modal-tab": "kipu-smbtn kipu-smbtn--text kipu-smbtn--compact",
    "preset-btn": "kipu-smbtn kipu-smbtn--outlined",
    "action-expand-btn": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "collapse-btn": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
    "expand-btn": "kipu-smbtn kipu-smbtn--text kipu-smbtn--icon",
}

_K_ORDER = sorted(_SPECS.keys(), key=len, reverse=True)
_DEFAULT = "kipu-smbtn kipu-smbtn--outlined"


def _kipu_for_classes(classes: list) -> str:
    if "kipu-smbtn" in classes:
        return None
    if "patient-header-action-btn" in classes:
        return None
    if "patient-name-icon-btn" in classes:
        return None
    for k in _K_ORDER:
        if k in classes:
            return _SPECS[k]
    return _DEFAULT


def _patch_open_tag(m: re.Match) -> str:
    tag = m.group(0)
    cm = re.search(r'class="([^"]*)"', tag)
    if not cm:
        return tag
    if "kipu-smbtn" in cm.group(1):
        return tag
    cl = [c for c in cm.group(1).split() if c]
    kipu = _kipu_for_classes(cl)
    if kipu is None:
        return tag
    new_c = " ".join(kipu.split() + cl)
    a, b = cm.span(1)
    return tag[:a] + new_c + tag[b:]


def main() -> None:
    text = INDEX.read_text(encoding="utf-8")
    if MARKER not in text:
        raise SystemExit("marker not found; abort")
    head, tail = text.split(MARKER, 1)
    new_head = re.sub(r"<button[^>]+>", _patch_open_tag, head, flags=re.IGNORECASE)
    if new_head == head:
        print("no <button> tags found in static HTML; nothing to do")
    INDEX.write_text(new_head + MARKER + tail, encoding="utf-8")
    print("Patched", INDEX, "— kipu-smbtn classes added to static HTML buttons.")


if __name__ == "__main__":
    main()
