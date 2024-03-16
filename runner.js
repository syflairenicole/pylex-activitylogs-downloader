// Activity Logs API: https://free.pylexnodes.net/api/client/servers/SERVER_ID_HERE/activity?sort=-timestamp&page=1&include[]=actor

const protocol = document.location.protocol;
const domain = document.domain;
const site = protocol + "//" + domain;

const logsAPI = "/api/client/servers/(id)/activity?sort=-timestamp&page=(page)&include[]=actor";
const panelRegex = /^(free|pro)\.pylexnodes.net$/;

if (typeof savingActivityLogs == "undefined") {
    savingActivityLogs = false;
};

function jsonSaveToFile(data, fileName) {
    const text = JSON.stringify(data);
    const blob = new Blob([text], {
        type: 'application/json'
    });
    
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (fileName || "pylex-unknownid-activity") + ".json";
    a.click();
    a.remove();
};

async function fetchLogsAPI(serverId, pageNumber) {
    if (!(serverId && pageNumber)) return;
    const logsPath = logsAPI.replace("(id)", serverId).replace("(page)", pageNumber);
    const logsResponse = await fetch(site + logsPath);
    try {
        const logsJson = await logsResponse.json();
        return logsJson;
    } catch {
        return;
    };
};

async function getActivityLogs(serverId, cursor, pageLimit) {
    const logsList = [];
    
    if (pageLimit) {
        for (let i = cursor; i <= (pageLimit); i++) {       
            const logsJson = await fetchLogsAPI(serverId, i);
            if (logsJson?.data) {
                logsList.push(...logsJson.data);
                const totalPages = logsJson.meta?.pagination?.total_pages;
                console.log(totalPages);
                if (totalPages && i >= totalPages) {
                    console.warn("pageLimit exceeded/reached total_pages metadata, job finished.");
                    break;
                };
            };
        };
    };

    return logsList;
};

function getServerId() {
    const pathName = window.location.pathname.split("/");
    if (pathName[1] == "server" && pathName[2] !="") return pathName[2];
};

async function saveActivityLogs(cursor, limit) {
    if (panelRegex.test(domain) != true) return console.warn("Access panel at https://free.pylexnodes.net or https://pro.pylexnodes.net");
    
    const serverId = getServerId();
    if (!serverId) return console.log("Please access your server first.");

    if (savingActivityLogs) return console.warn("Still fetching activity logs, please wait.");
    savingActivityLogs = true;

    const activityLogs = await getActivityLogs(serverId, cursor || 1, limit || 1);
    if (activityLogs) jsonSaveToFile(activityLogs, `pylex-${serverId}-activity`);

    savingActivityLogs = false;
};

let cursor = null;
let limit = null;

//eval:cursor;
//eval:limit;

/* 
 - eval arguments for external loaders (to change the variables)
 - usage:
     evalString.replace("//eval:cursor", "cursor = number");
     evalString.replace("//eval:limit", "limit = number");
*/

saveActivityLogs(cursor, limit);
