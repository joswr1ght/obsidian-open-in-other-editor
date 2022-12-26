import { Plugin } from 'obsidian';
import * as os from 'os';


function runCMD(cmd: string) {
  const { exec } = require("child_process");
  exec(cmd, (error: string, stdout: string, stderr: string) => {
    if (error) {
      console.error(`run cmd err: ${error}, ${stdout}, ${stderr}`);
      return;
    }
    console.log(`run cmd: ${cmd}`);
  });
}
export default class OpenFilePlg extends Plugin {
	async onload() {

		this.addCommand({
			id: 'open-in-other-editor-gvim',
			name: 'Open current active file in gVim',
			callback: () => {
				this.open("gvim")
			}
		});

		this.addCommand({
			id: 'open-in-other-editor-vscode',
			name: 'Open current active file in VScode',
			callback: () => {
				this.open("code")
			}
		});
	}

	onunload() {
	}

	private open(by : "gvim"| "code") {
		let curFilePath = this.app.workspace.getActiveFile()?.path
		if (!curFilePath) {
			console.warn("no active file in workspace");
			return
		}
		let cwd = this.app.vault.adapter.getResourcePath(".")
		cwd = decodeURI(cwd.replace("app://local/", "").replace(/\?\d+.*?/, ""))
		if (os.type() === "Windows_NT") {
			runCMD(`cd /d ${cwd} && ${by} ./"${curFilePath}"`)
		} else {
			//runCMD(`cd /${cwd} && ${by} "${curFilePath}"`)
			// I don't want to install and configure MacVIM, I want to open in iTerm2 in vim
			// To do this I copied some Applescript from https://apple.stackexchange.com/a/444250
			// I copied the procedure from here https://www.mattcrampton.com/blog/doubleclick_to_open_in_vim_on_osx/ to create TerminalVimOpen.app
			// Modifying this plugin to launch this Applescript stub (losing VS Code integration, but I don't care about that):
			runCMD(`"/Applications/TerminalVimOpen.app//Contents/MacOS/Automator Application Stub" "/${cwd}/${curFilePath}"`);
		}
	}
}
