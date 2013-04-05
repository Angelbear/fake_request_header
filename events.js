/*global Policy, chrome, Datastore */
var data, rePatterns;

function beforeEventCallback(details){
    var matchedUrl = details.url;
    var index = 0;
    rePatterns.some(function(pattern){
        ++index;
        return pattern.test(matchedUrl);
    });
    var policy = data[index - 1];
    var targetHeaders = Object.keys(policy.rules);
    var sendHeaders = details.requestHeaders;

    targetHeaders.forEach(function(name){
        var value = Policy.calculateRuledValue(policy.rules[name], matchedUrl);
        if(value.ruletype == "noop") {
            return;
        }

        for (var i = 0; i < sendHeaders.length; ++i) {
            if (sendHeaders[i].name == name) {
                if (value.ruletype == "fixed" || value.ruletype == "empty") {
                    sendHeaders[i].value = value.value;
                } else if (value.ruletype == "extra") {
                    sendHeaders[i].value = sendHeaders[i].value + value.value;
                }
            }
        }
    });

    return {
        requestHeaders: sendHeaders
    };
}

function setupEventMonitor() {
    data = Datastore.load();
    rePatterns = data.map(function(policy){ return new RegExp(policy.pattern.replace(/\*/g, ".*")); });

    chrome.webRequest.onBeforeSendHeaders.addListener(
            beforeEventCallback,
            {
                urls: data.map(function(rule){ return rule.pattern; })
            },
            ["blocking", "requestHeaders"]
    );
}


chrome.extension.onMessage.addListener(
    function(message){
        if(message === "DataUpdated") {
            chrome.webRequest.onBeforeSendHeaders.removeListener(beforeEventCallback);
            setupEventMonitor();
        }
    }
);

chrome.browserAction.onClicked.addListener(function(tab) {
    
});

setupEventMonitor();