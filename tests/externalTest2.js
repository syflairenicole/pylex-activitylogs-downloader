// Runs automatically with - https://chrome.google.com/webstore/detail/lmilalhkkdhfieeienjbiicclobibjao
// Access panel first, then paste & save code, and also check 'Enable On' in the user interface. (To run automatically when you visit the page)

// Add buttons to download activity logs for servers shown on the panel dashboard
// https://free.pylexnodes.net or https://pro.pylexnodes.net

fetch("https://raw.githubusercontent.com/syflairenicole/pylex-activitylogs-downloader/main/addDownloadButtons.js").then(async data => {
    try {
        const buttonsExtension = await data.text();
        const scriptElement = document.createElement("script");
        scriptElement.innerText = buttonsExtension;
        document.body.appendChild(scriptElement);
    } catch (errorMsg) {
        console.warn("Extension could not be loaded:", errorMsg);
    });
});
