var waitPromise = async function(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms || 100));
};

var getElementsByAttribute = function(tag, attr, value) {
    if ('querySelectorAll' in document) {
        return document.querySelectorAll((tag || "") + "["+attr+"="+`"${value}"`+"]" );
    } else {
        var els = document.getElementsByTagName("*"),
            result = []

        for (var i=0, _len=els.length; i < _len; i++) {
            var el = els[i]

            if (el.hasAttribute(attr)) {
                if (el.getAttribute(attr) === value) result.push(el)
            }
        }

        return result
    }
};

var downloadActivityLogs = function(cursor, pagelimit, serverId) {
    fetch("https://raw.githubusercontent.com/syflairenicole/pylex-activitylogs-downloader/main/runner.js").then(async data => {
        let runnerJS = await data.text();
        if (runnerJS) {
            runnerJS = runnerJS.replace("//eval:cursor", `cursor = ${cursor}`);
            runnerJS = runnerJS.replace("//eval:limit", `limit = ${pagelimit}`);
            runnerJS = runnerJS.replace("//eval:server_id", `serverId = "${serverId}"`);
            eval(runnerJS);
        };
    });
};

var loadExtension = async function() {
    if (document.pylexActivityLogsExtension) return console.warn("Extension already loaded.");
    document.pylexActivityLogsExtension = true;
    document.downloadActivityLogs = downloadActivityLogs;

    const protocol = document.location.protocol;
    const domain = document.domain;
    const site = protocol + "//" + domain;
    
    const serversAPI = "/api/client";
    const elementTemplate = `<a width="60px" height="60px" onclick="(code)" href="javascript:void(0)" style="position:absolute;margin-left: 100.5%;background-color:rgb(70,70,70);width: 40px;height: 60px;"><img width="60" height="60" src="https://img.icons8.com/ios/50/aaaaaa/download--v1.png" alt="download--v1" style="
    padding-top: 7px;
"></a>`;

    const serverList = [];
    const apiResponse = await fetch(site + serversAPI);
    try {
        const serversJson = await apiResponse.json();
        serversJson.data.forEach((obj) => {
            if (obj.object != "server") return;
            const identifier = obj.attributes.identifier;
            const serverName = obj.attributes.name;
            const serverElements = getElementsByAttribute("a", "href", "/server/" + identifier);

            serverElements.forEach(serverCard => {
                const element = document.createElement("a");
                element.hidden = true;

                serverCard.append(element);
                serverCard.style.marginRight = "50px";
                serverCard.style.overflow = "visible";
                element.hidden = false;
                element.outerHTML = elementTemplate.replace("(code)", `if (confirm('Do you want to download activity logs for ${serverName} (id: ${identifier})?')) { document.downloadActivityLogs(1, 999, '${identifier}'); }; event.stopPropagation();`);
            });
        });
    } catch(msg) { console.warn(msg);
        window.pylexActivityLogsExtension = false;
        alert("Failed to fetch servers from API.");
    };
};

(async () => {
    while (true) {
        await waitPromise(2000);
        if (getElementsByAttribute("a", "href^", "/server/")?.length > 0) break;
    };
    loadExtension();
})();
