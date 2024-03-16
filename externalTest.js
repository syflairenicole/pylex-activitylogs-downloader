// Access your server and paste this in the console. 
// A file named 'pylex-serverid-activity.json' will be downloaded after running this.

fetch("https://raw.githubusercontent.com/syflairenicole/pylex-activitylogs-downloader/main/runner.js").then(async data => {
    let runnerJS = await data.text();
    if (runnerJS) {
      let cursor = 1; // Starting page
      let pagelimit = 1; // Max pages to return

      runnerJS.replace("//eval:cursor", `cursor = ${cursor}`);
      runnerJS.replace("//eval:limit", `limit = ${pagelimit}`);

      eval(runnerJS); // A json file with a list of activity logs will be downloaded
    };
});
