// ==UserScript==
// @name         AtCoder Create Test
// @namespace    atcoder_create_test
// @version      0.3.3
// @description  AtCoderのテストケースを自動生成
// @author       kgtkr
// @match        https://atcoder.jp/contests/*/tasks/*
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
    var formatters = [
        function (cases) {
            return "tests! {\n" + cases.map(function (_a, i) {
                var input = _a[0], output = _a[1];
                return "    test" + (i + 1) + ": " + JSON.stringify(input) + " => " + JSON.stringify(output) + ",";
            }).join("\n") + "\n}";
        },
        function (cases) {
            return "===\n---\n" + cases.map(function (_a) {
                var input = _a[0], output = _a[1];
                return input + "\n---\n" + output;
            }).join("\n===\n");
        }
    ];
    var texts = Array.from(document.getElementsByClassName("part")).filter(function (x) {
        var els = x.getElementsByTagName("h3");
        if (els.length !== 0) {
            var el = els[0];
            var text = el.innerText;
            return text.includes("入力例") || text.includes("出力例");
        }
        else {
            return false;
        }
    }).map(function (x) { return x.getElementsByTagName("pre")[0].innerText; });
    if (texts.length !== 0 && texts.length % 2 === 0) {
        var cases_1 = unflatten(texts, 2);
        var html = formatters.map(function (f) { return f(cases_1); }).map(function (x) { return "<textarea rows=\"10\" cols=\"64\">" + escapeHtml(x) + "</textarea>"; }).join("");
        document.getElementById("task-statement").insertAdjacentHTML('afterend', html);
    }
})();
