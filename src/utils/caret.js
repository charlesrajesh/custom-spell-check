// get the cursor position from .editor start
export function getCursorPosition(parent, node, offset, stat) {
  const statObj = stat;
  if (statObj.done) return statObj;

  let currentNode = null;
  if (parent.childNodes.length === 0) {
    statObj.pos += parent.textContent.length;
  } else {
    for (let i = 0; i < parent.childNodes.length && !statObj.done; i += 1) {
      currentNode = parent.childNodes[i];
      if (currentNode === node) {
        statObj.pos += offset;
        statObj.done = true;
        return statObj;
        // eslint-disable-next-line
      } else getCursorPosition(currentNode, node, offset, statObj);
    }
  }
  return statObj;
}

//  find the child node and relative position and set it on range
export function setCursorPosition(parent, range, stat) {
  const statObj = stat;

  if (statObj.done) return range;

  if (parent.childNodes.length === 0) {
    if (parent.textContent.length >= statObj.pos) {
      range.setStart(parent, statObj.pos);
      statObj.done = true;
    } else {
      statObj.pos -= parent.textContent.length;
    }
  } else {
    for (let i = 0; i < parent.childNodes.length && !statObj.done; i += 1) {
      const currentNode = parent.childNodes[i];
      setCursorPosition(currentNode, range, statObj);
    }
  }
  return range;
}

export const restoreCaretPostion = (node, pos, selection, editorCurrent) => {
  if (!node?.childNodes[0] || node?.childNodes[0]?.nodeName !== 'BR') {
    //  remove range for non newline case (avoid just empty enter node)
    selection.removeAllRanges();
  }
  const range = setCursorPosition(editorCurrent, document.createRange(), {
    pos: pos.pos,
    done: false,
  });
  range.collapse(true);
  selection.addRange(range);
};

export const getWordByCaretPosition = () => {
  const currentSelection = window.getSelection();
  currentSelection.modify('extend', 'backward', 'word');
  const preCaret = currentSelection.toString();
  currentSelection.modify('extend', 'forward', 'word');
  const postCaret = currentSelection.toString();
  currentSelection.removeAllRanges();
  return [preCaret + postCaret, currentSelection.focusNode];
};
