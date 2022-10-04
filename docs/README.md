# 粘贴图片

- situation: vscode markdown

- 要求:

  粘贴图片

  压缩图片

  > JPEGs are designed to efficiently store high-quality digital photos packed with detail and color. They compress large images into much smaller file sizes, making them easier to share and upload online.

  !> 但是我发现, 通过 powershell 生成的 png 是比 jpg 小的

## inspire

阅读[vscode-paste-image](https://github.com/mushanshitiancai/vscode-paste-image)

> 借鉴一些有用的想法, 不必完全照抄, 等价实现

- 如果要进入 wsl 的状态调试, 则原来的环境就要切换到 wsl 模式再进入 debug 模式

- 采用绑定 ps 的方法
- 先写逻辑, 然后定义函数
- bug

  当在 markdown 中选中一段文字的时候, 会与 markdown all in one 冲突, 它会屏蔽这个

- 采用代理的想法, 路径

## reference

- tutorial for vscode extension
  - [Creating Your First Visual Studio Code Extension](https://youtu.be/OhfOcqSU62g)
  - [LIVE 🔴: Build your first VS Code extension](https://youtu.be/PGAu06_E_BU)
  - [How To Create And Deploy A VSCode Extension](https://www.youtube.com/watch?v=q5V4T3o3CXE)
  - [How to Code a VSCode Extension](https://www.youtube.com/watch?v=a5DX5pQ9p5M)
  - [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)
- example of vscode extension about image paste
  - [vscode-paste-image](https://github.com/mushanshitiancai/vscode-paste-image)
  - [vscode-extension-mardown-image-paste](https://github.com/njleonzhang/vscode-extension-mardown-image-paste)
- the library about compressing images
  - [compressorjs](https://github.com/fengyuanchen/compressorjs)
