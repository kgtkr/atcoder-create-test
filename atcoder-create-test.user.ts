// ==UserScript==
// @name         AtCoder Create Test
// @namespace    atcoder_create_test
// @version      0.2
// @description  AtCoder Beta版のテストケースを自動生成
// @author       kgtkr
// @match        https://beta.atcoder.jp/contests/*/tasks/*
// ==/UserScript==


(() => {
  "use strict";
  function unflatten<T>(arr: T[], c: number) {
    return arr.reduce<T[][]>((r, x, i) => {
      if (i % c == 0) {
        r.push([]);
      }

      r[r.length - 1].push(x);
      return r;
    }, []);
  }

  const escapeMap: { [key: string]: string } = {
    '&': '&amp;',
    "'": '&#x27;',
    '`': '&#x60;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
  };

  function escapeHtml(string: string) {
    return string.replace(/[&'`"<>]/g, (match) => {
      return escapeMap[match]
    });
  }

  let pre = null;
  const texts = [];
  for (let i = 0; pre = document.querySelector<HTMLElement>(`.lang-ja #pre-sample${i}`); i++) {
    texts.push(pre.innerText.trim());
  }

  if (texts.length === 0) {
    for (let i = 0; pre = document.getElementById(`pre-sample${i}`); i++) {
      texts.push(pre.innerText.trim());
    }
  }

  if (texts.length !== 0 && texts.length % 2 === 0) {
    const cases = unflatten(texts, 2);
    const rustCode = "tests! {\n" + cases.map(([input, output], i) => `    test${i + 1}: ${JSON.stringify(input)} => ${JSON.stringify(output)},`).join("\n") + "\n}";
    const haskellCode = "===\n---\n" + cases.map(([input, output]) => input + "\n---\n" + output).join("===\n");
    document.getElementById("task-statement")!.insertAdjacentHTML('afterend', `<textarea rows="10" cols="64">${escapeHtml(rustCode)}</textarea><textarea rows="10" cols="64">${escapeHtml(haskellCode)}</textarea>`);
  }
})();