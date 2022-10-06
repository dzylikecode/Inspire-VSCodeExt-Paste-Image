# 插件

## 编写

- [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)

## 压缩代码

- [Using esbuild](https://code.visualstudio.com/api/working-with-extensions/bundling-extension#using-esbuild)

  - 安装 esbuild

    ```bash
    npm i --save-dev esbuild
    ```

    放到 dev 里面, 而不是 dependence 里面

以下是给`npm run`使用的命令:可以使用`npm run`试探一下, 会给出相应的选项

```json
"scripts": {
    "vscode:prepublish": "npm run esbuild-base -- --minify", // 发布时预先进行的命令 => 即调用下面的命令
    "esbuild-base": "esbuild ./src/extension.ts --bundle --outfile=out/main.js --external:vscode --format=cjs --platform=node",
    "esbuild": "npm run esbuild-base -- --sourcemap",
    "esbuild-watch": "npm run esbuild-base -- --sourcemap --watch",
    "test-compile": "tsc -p ./"
},
```

!> 记得修改`package.json`中的`main`字段, 使其指向`out/main.js`

## 发布

```bash
vsce package # 会执行 npm run vscode:prepublish
```

!> 记得排除不要发布的文件

- .vscodeignore

  生成插件时需要忽略哪些文件, 比如`node_modules`文件夹

## 上传

- [Publishing Extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

  > 网页管理简便
