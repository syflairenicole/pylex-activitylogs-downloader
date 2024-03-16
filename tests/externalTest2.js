// Add buttons to download activity logs for servers shown on the panel dashboard
// https://free.pylexnodes.net or https://pro.pylexnodes.net

fetch("https://raw.githubusercontent.com/syflairenicole/pylex-activitylogs-downloader/main/addDownloadButtons.js").then(async data => {
    const runnerJS = await data.text();
    eval(runnerJS);
});
