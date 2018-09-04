// ==UserScript==
// @name         AtCoder Create Test
// @namespace    atcoder_create_test
// @version      0.2
// @description  AtCoder Beta版のテストケースを自動生成
// @author       kgtkr
// @match        https://beta.atcoder.jp/contests/*/tasks/*
// ==/UserScript==
(function () {
    "use strict";
    function unflatten(arr, c) {
        return arr.reduce(function (r, x, i) {
            if (i % c == 0) {
                r.push([]);
            }
            r[r.length - 1].push(x);
            return r;
        }, []);
    }
    var escapeMap = {
        '&': '&amp;',
        "'": '&#x27;',
        '`': '&#x60;',
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;',
    };
    function escapeHtml(string) {
        return string.replace(/[&'`"<>]/g, function (match) {
            return escapeMap[match];
        });
    }
    var pre = null;
    var texts = [];
    for (var i = 0; pre = document.querySelector(".lang-ja #pre-sample" + i); i++) {
        texts.push(pre.innerText.trim());
    }
    if (texts.length === 0) {
        for (var i = 0; pre = document.getElementById("pre-sample" + i); i++) {
            texts.push(pre.innerText.trim());
        }
    }
    if (texts.length !== 0 && texts.length % 2 === 0) {
        var cases = unflatten(texts, 2);
        var rustCode = "tests! {\n" + cases.map(function (_a, i) {
            var input = _a[0], output = _a[1];
            return "    test" + (i + 1) + ": " + JSON.stringify(input) + " => " + JSON.stringify(output) + ",";
        }).join("\n") + "\n}";
        var haskellCode = "===\n---\n" + cases.map(function (_a) {
            var input = _a[0], output = _a[1];
            return input + "\n---\n" + output;
        }).join("===\n");
        document.getElementById("task-statement").insertAdjacentHTML('afterend', "<textarea rows=\"10\" cols=\"64\">" + escapeHtml(rustCode) + "</textarea><textarea rows=\"10\" cols=\"64\">" + escapeHtml(haskellCode) + "</textarea>");
    }
})();
