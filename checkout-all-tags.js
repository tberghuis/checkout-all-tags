#!/usr/bin/env node

const shell = require("shelljs");

let url = process.argv.slice(2)[0];
// todo allow outputdir as option
let outputDir = process.cwd();

if (!url) {
  // only during dev
  // url = "https://github.com/Code-Pop/watch-us-build-trello.git";
  // todo die, "please provide repo url"
  console.log("Usage: checkout-all-tags.js https://github.com/user/repo.git");
  process.exit(1);
}

const repoName = getRepoName(url);

shell.exec(`git clone ${url} ${repoName}`);
shell.cd(repoName);

// const masterCloneDir = shell.pwd();

const tags = shell.exec("git tag").stdout.split("\n");
tags.pop();
shell.cd(outputDir);
shell.mkdir("tags");

tags.forEach((tag) => {
  shell.cd(`${outputDir}/tags`);
  shell.mkdir(tag);
  shell.cd(tag);
  shell.exec(`ln -s ${outputDir}/${repoName}/.git .git`);
  shell.exec(`git reset --hard`);
  shell.exec(`git checkout tags/${tag}`);
  shell.exec(`rm .git`);
});

// debugger;

//////////////////////////
// functions here

function getRepoName(url) {
  return url.substring(url.lastIndexOf("/") + 1).split(".")[0];
}
