import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './styles/App.scss';
import MyCustomContextMenu from './components/MyContextMenu';
import { getSpellingErrors, updateSpellingErrors } from './redux/actions';
import { getCursorPosition, restoreCaretPostion, getWordByCaretPosition } from './utils/caret';
import { notifySpellingErrors, replaceErrorWord } from './utils/spellCheck';

function App() {
  const editor = useRef({ current: null });
  const [selection, setSelection] = useState(null);
  const [wordToReplace, setWordToReplace] = useState(null);
  const [contextMenuOptions, setContextMenuOptions] = useState([]);
  const dispatch = useDispatch();
  const spellingErrors = useSelector(
    (state) => state.reducer.ContentEditableReducer.spellingErrors,
  );

  let controller;

  useEffect(() => {
    editor.current.innerHTML = '<p><br/></p>';
  }, []);

  useEffect(() => {
    if (spellingErrors.length > 0 && editor.current !== null && selection !== null) {
      const node = selection.focusNode;
      const offset = selection.focusOffset;
      const pos = getCursorPosition(editor.current, node, offset, { pos: 0, done: false });
      const isEmptyNewline = node?.childNodes[0]?.nodeName !== 'BR';
      notifySpellingErrors(isEmptyNewline, editor.current, spellingErrors);
      //  restore the position
      restoreCaretPostion(node, pos, selection, editor.current);
    }
  }, [spellingErrors]);

  const handleInput = (e) => {
    //  remove dangerous backspace
    if (editor.current.innerText.length === 0) {
      editor.current.innerHTML = '<p><br/></p>';
      e.preventDefault();
      return;
    }

    //  if prev request pending, abort
    if (controller) controller.abort();

    controller = new AbortController();
    const notepadText = editor.current.innerText.replace(/&nbsp/gm, ' ').replace(/\n\n/gm, ' ');
    dispatch(getSpellingErrors(notepadText, controller.signal));
  };

  const onOptionSelect = (option) => {
    const updatedSpellingErrors = spellingErrors.filter(
      (errorWord) => errorWord.bad !== wordToReplace,
    );
    replaceErrorWord(wordToReplace.word, editor.current, updatedSpellingErrors, option);
    dispatch(updateSpellingErrors(updatedSpellingErrors));
    setWordToReplace(null);
    setContextMenuOptions(null);
  };

  const handleRightClick = () => {
    const [clickedWord, focusNode] = getWordByCaretPosition();
    const clickedWordSet = spellingErrors.filter(
      (errorWord) => clickedWord.trim() === errorWord.bad,
    );
    if (clickedWordSet.length > 0) {
      setContextMenuOptions(clickedWordSet[0].better);
      setWordToReplace({
        selectionFocusNode: focusNode,
        word: clickedWord,
      });
    } else {
      setWordToReplace(null);
      setContextMenuOptions(null);
    }
  };

  return (
    <div className="App">
      {contextMenuOptions && (
        <MyCustomContextMenu
          targetId="MySpellCheckerApp"
          options={contextMenuOptions}
          onOptionSelect={onOptionSelect}
        />
      )}
      {/* eslint-disable-next-line */}
      <div
        id="MySpellCheckerApp"
        className="MySpellCheckerApp"
        contentEditable="true"
        suppressContentEditableWarning="true"
        spellCheck="false"
        ref={editor}
        onContextMenu={handleRightClick}
        onKeyDown={() => setSelection(window.getSelection())}
        onInput={handleInput}
        onPaste={(e) => e.preventDefault()}
      />
    </div>
  );
}

export default App;
