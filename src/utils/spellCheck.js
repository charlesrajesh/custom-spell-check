export const notifySpellingErrors = (isEmptyNewline, editorCurrent, spellingErrors) => {
  const spellingErrorWords = spellingErrors.map((errorWord) => errorWord.bad);
  for (let i = 0; i < editorCurrent.childNodes.length; i += 1) {
    //  avoid edtior on newline without char
    if (isEmptyNewline) {
      //  eslint-disable-next-line
      editorCurrent.childNodes[i].innerHTML = parse(
        editorCurrent.childNodes[i].innerText,
        spellingErrorWords,
      );
    }
  }
};

export const parse = (text, errorWordList) => {
  let updatedText = text;
  for (let i = 0; i < errorWordList.length; i += 1) {
    const regex = new RegExp(`\\b${errorWordList[i]}\\b`, 'g');
    updatedText = updatedText.replace(regex, `<strong>${errorWordList[i]}</strong>`);
  }
  return updatedText;
};

export const replaceErrorWord = (wordToReplace, editorCurrent, updatedSpellingErrors, option) => {
  const regex = new RegExp(`\\b${wordToReplace}\\b`, 'g');

  const updatedSpellingErrorWords = updatedSpellingErrors.map((errorWord) => errorWord.bad);
  for (let i = 0; i < editorCurrent.childNodes.length; i += 1) {
    const updatedInnerHtml = editorCurrent.childNodes[i].innerText
      .replace(regex, ` ${option} `)
      .trim();
    //    eslint-disable-next-line
    editorCurrent.childNodes[i].innerHTML = parse(updatedInnerHtml, updatedSpellingErrorWords);
  }
};
