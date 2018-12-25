// ==UserScript==
// @name         AtCoder Create Test
// @namespace    atcoder_create_test
// @version      0.3.3
// @description  AtCoder Beta版のテストケースを自動生成
// @author       kgtkr
// @match        https://atcoder.jp/contests/*/tasks/*
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

  const formatters = [
    (cases: string[][]) => "tests! {\n" + cases.map(([input, output], i) => `    test${i + 1}: ${JSON.stringify(input)} => ${JSON.stringify(output)},`).join("\n") + "\n}",
    (cases: string[][]) => "===\n---\n" + cases.map(([input, output]) => input + "\n---\n" + output).join("\n===\n")
  ];

  const texts = Array.from(document.getElementsByClassName("part")).filter(x => {
    const els = x.getElementsByTagName("h3");
    if (els.length !== 0) {
      const el = els[0];
      const text = el.innerText;
      return text.includes("入力例") || text.includes("出力例");
    } else {
      return false;
    }
  }).map(x => x.getElementsByTagName("pre")[0].innerText);

  if (texts.length !== 0 && texts.length % 2 === 0) {
    const cases = unflatten(texts, 2);
    const html = formatters.map(f => f(cases)).map(x => `<textarea rows="10" cols="64">${escapeHtml(x)}</textarea>`).join("");
    document.getElementById("task-statement")!.insertAdjacentHTML('afterend', html);
  }
})();