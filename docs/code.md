# 代码

## debug

- 如果要进入 wsl 的状态调试, 则原来的环境就要切换到 wsl 模式再进入 debug 模式

## main logic

1. 获取需要设定的名字
2. 获取需要保存的路径
3. 保存文件
4. 渲染 markdown

## standard

- 先写逻辑, 然后定义函数

  类似于在一个文件中划分函数写一样

  ```js
  function main() {
    // what to do
    method1();
    method2();
    // ...
    return;
    function method1() {}
    function method2() {}
  }
  ```

- 对于调用其他接口, 用一个文件夹包裹

  如对于`clipboard`, 核心是使用 powershell, 所以放在`clipboard`文件夹中, 然后创建一个`clipboard.js`提供 js 的调用接口

- 配置文件, 使用设计模式进行透明代理

  如获取当前配置路径`currentDirPath`, 实际上是一个`getter`

## issue

- 当在 markdown 中选中一段文字的时候, 会与 markdown all in one 冲突, 它会屏蔽当前的插件

- 不知道如何打包, 似乎发布插件的时候, 它提示我的 js 文件过多

## 心得

> 借鉴一些有用的想法, 不必完全照抄, 等价实现

当时很想一下子完全实现[Paste Image](https://marketplace.visualstudio.com/items?itemName=mushan.vscode-paste-image)的全部功能, 想完全按照他的思路来, 后来想想, 自己应该解决自己的问题, 而不是照抄. 而且, 满是回调的代码形式, 我看得头晕, 厌烦:sweat_smile:. 把握其中精髓的形式就好了:yum:. 还是非常感谢[Paste Image](https://marketplace.visualstudio.com/items?itemName=mushan.vscode-paste-image)提供的想法:heartbeat::heartbeat::heartbeat:
