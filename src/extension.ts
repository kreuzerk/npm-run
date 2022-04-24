// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import path = require('path');
import * as vscode from 'vscode';
import passingIcon from 'vscode-codicons/src/icons/database.svg';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const packageJSONfileName = 'package.json';

  const decorators = [
    {
      range: new vscode.Range(10, 0, 10, 1),
      hoverMessage: 'Some hover text',
      identifier: 'unique',
    },
  ];

  const editor = vscode.window.activeTextEditor;
  const decorationType = createStateDecoration([
    prepareIconFile(context, 'passing', passingIcon, '#35A15E'),
    'green',
  ]);
  editor?.setDecorations(decorationType, decorators);

  /*
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "npm-run" is now active!');
  vscode.window.showInformationMessage(
    'Hello World from my awesome extension!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('npm-run.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage(
      'Hello World from my awesome extension!'
    );
  });
  context.subscriptions.push(disposable);
  */
}

// this method is called when your extension is deactivated
export function deactivate() {}

function createStateDecoration(
  dark: /* default */ [string, string?],
  light?: /* optional overrides */ [string, string?]
): vscode.TextEditorDecorationType {
  const [icon, overviewRulerColor] = dark;
  const [iconLite, overviewRulerColorLite] = light ?? [];

  const options: vscode.DecorationRenderOptions = {
    gutterIconPath: icon,
    gutterIconSize: 'contain',
    overviewRulerLane: vscode.OverviewRulerLane.Left,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    dark: {
      gutterIconPath: icon,
    },
    light: {
      gutterIconPath: iconLite || icon,
    },
  };

  if (overviewRulerColor) {
    options['overviewRulerColor'] = overviewRulerColor;
    if (options['dark']) {
      options['dark']['overviewRulerColor'] = overviewRulerColor;
    }
  }

  if (overviewRulerColorLite) {
    if (options['light']) {
      options['light']['overviewRulerColor'] = overviewRulerColorLite;
    }
  }

  return vscode.window.createTextEditorDecorationType(options);
}

export function prepareIconFile(
  context: vscode.ExtensionContext,
  iconName: string,
  source: string,
  color?: string
): string {
  const iconsPath = join('generated-icons');

  const resolvePath = (...args: string[]): string => {
    return context.asAbsolutePath(join(...args));
  };

  const resultIconPath = resolvePath(iconsPath, `${iconName}.svg`);
  let result = source.toString();

  if (color) {
    result = result.replace('fill="currentColor"', `fill="${color}"`);
  }

  if (
    !existsSync(resultIconPath) ||
    readFileSync(resultIconPath).toString() !== result
  ) {
    if (!existsSync(resolvePath(iconsPath))) {
      mkdirSync(resolvePath(iconsPath));
    }

    writeFileSync(resultIconPath, result);
  }

  return resultIconPath;
}
