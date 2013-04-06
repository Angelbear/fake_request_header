/*global chrome */
var Policy = (function(){
  "use strict";

  var patternRegex = new RegExp('^(?:\\*|https?)://(?:\\*|(?:\\*[.])[^\\*]*|[^\\*]+)/.*$');

  var validate = function(policy) {
    if(!policy.name) return false;
    if(!policy.pattern) return false;
    if(!patternRegex.test(policy.pattern)) return false;

    // validation for URL pattern
    // http://developer.chrome.com/extensions/match_patterns.html
    try {
      var dummy = function(){};
      chrome.webRequest.onBeforeSendHeaders.addListener(
        dummy,
        { urls: [policy.pattern] },
        ["blocking", "requestHeaders"]
      );
      chrome.webRequest.onBeforeSendHeaders.removeListener(dummy);
      return true;
    } catch(e) {
      console.log("unfiltered regex but illegal policy.pattern", policy.pattern);
      return false;
    }
  };

  var ruletypes = function(policy) {
    if (policy == "Cookie") {
        return  {
            noop: {
              label: "noop",
              desc: "nothing to do"
            },
            empty: {
              label: "empty",
              desc: "don't send"
            },
            fixed: {
              label: "fixed",
              desc: "always send fixed string (%URL% is a special value that will be replaced by matched URL)"
            },
            extra: {
              label: "extra",
              desc: "add extra string"
            }
        };
    } else {
        return {
            noop: {
              label: "noop",
              desc: "nothing to do"
            },
            empty: {
              label: "empty",
              desc: "don't send"
            },
            fixed: {
              label: "fixed",
              desc: "always send fixed string (%URL% is a special value that will be replaced by matched URL)"
           },
        };
     }
  };

  var calculateRuledValue = function(rule, url) {
    var value = new Object();
    value.ruletype = rule.ruletype;
    switch(rule.ruletype) {
      case "noop":
        return value;

      case "empty":
        value.value = "";
        return value;

      case "fixed":
        value.value =  rule.value.replace("%URL%", url);
        return value;

      case "extra":
        value.value = rule.value;
        return value;
    }
  };


  var rulepattern = function(policy) {
      switch(policy) {
          case "User-Agent":
          case "Referer":
              return new RegExp("^.+$");
          case "Cookie":
              return new RegExp("^(\\s*[^=;\\s]+=[^=;\\s]*\\s*;)*$");
      }
      return new RegExp("^.+$");
  }

  return {
    RULES: ["Referer", "Cookie", "User-Agent"],
    RULETYPES: ruletypes,
    RULEPATTERN: rulepattern,
    patternRegex: patternRegex,
    validate: validate,
    calculateRuledValue: calculateRuledValue
  };
})();
