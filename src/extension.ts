// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { docParse } from "./test.js";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "jsdoc-prettier" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "jsdoc-prettier.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from jsdoc-prettier!");
    }
  );

  let onsave = vscode.workspace.onDidSaveTextDocument(
    (document: vscode.TextDocument) => {
      console.log("FIRED");
      const editor = vscode.window.activeTextEditor;

      console.log(document.languageId);

      if (
        editor &&
        (document.languageId === "javascript" ||
          document.languageId === "javascriptreact")
      ) {
        console.log("RUN");
        let lines = findLineWithImportDeclaration(document);

        let i = 0;

        editor.edit((editBuilder) => {
          for (let line of lines) {
            const start = new vscode.Position(line, 0);
            const end = new vscode.Position(line + 1, 0);
            const range = new vscode.Range(start, end);

            const s = document.lineAt(line).text;
            const parsed = docParse(s);

            // delete old line, insert new line
            editBuilder.delete(range);
            editBuilder.insert(start, parsed.type + "\n");
            editBuilder.insert(
              new vscode.Position(1, 0),
              parsed.typedef + "\n"
            );

            // editBuilder.replace(range, updatedLine);
          }
        });
      }
    }
  );

  context.subscriptions.push(onsave);
  // context.subscriptions.push(disposable);
}

function findLineWithImportDeclaration(
  document: vscode.TextDocument
): number[] {
  const linesToReplace: number[] = [];

  for (let line = 0; line < document.lineCount; line++) {
    const text = document.lineAt(line).text;
    if (
      text.includes("/** @type {import(") ||
      text.includes("* @param {import(")
    ) {
      linesToReplace.push(line);
    }
  }
  return linesToReplace;
}

// This method is called when your extension is deactivated
export function deactivate() {}
