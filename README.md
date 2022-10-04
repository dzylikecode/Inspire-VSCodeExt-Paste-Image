# md-paste-enhanced

Who can help me write the docs? :sob: :sob: :sob:

It works the same as [Paste Image](https://marketplace.visualstudio.com/items?itemName=mushan.vscode-paste-image). What I focus on is to make it work well on WSL and Windows and to use `ctrl + v` to paste images instead of `ctrl + alt + v`.

## Features

use `ctrl + v` to paste images from the clipboard when writing markdown.

## Extension Settings

- `pasteImage.path`

  The destination to save image file.

  You can use variable:

  - `${currentFileDir}`: the path of directory that contain current editing file.
  - `${projectRoot}`: the path of the project opened in vscode.

- `pasteImage.basePath`

  The base path of image url.

  You can use variable:

  - `${currentFileDir}`: the path of directory that contain current editing file.
  - `${projectRoot}`: the path of the project opened in vscode.

## Known Issues

> The plugin `Markdown All in One` will block the function that you paste image when selecting text. It's better to remove the condition that triggers paste `ctrl+v` in the shortcut settings of `Markdown All in One`. Don't worry, this plugin will call the paste function of `Markdown All in One`. I just think it's a bit of a hassle, why they can't work together without realizing the exsistence of each other.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release

### 0.0.2

remove annoying notification

---

## more feature

If you want more feature, for example, make it work on Mac and Linux, Please open an issue or pull request. :smirk: :smirk: :smirk:

**Enjoy!** :blush: :blush: :blush:
