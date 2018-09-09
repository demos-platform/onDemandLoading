### 按需加载实践

为了探究按需加载的本质，选择了对先前造的轮子 [diana](https://github.com/MuYunyun/diana) 进行实验。

#### 实验一：全量引用

```js
import * as _ from 'diana'
```

打包体积结果如下：

![](http://oqhtscus0.bkt.clouddn.com/6de21bdb4cd2ac1d52a6e2af839ddeb0.jpg)

> 测试的是 [diana 0.4.1](https://github.com/MuYunyun/diana/tree/v0.4.1/lib)

#### 实验二：部分引用

```js
import { equal } from 'diana'
```

打包体积结果如下：

![](http://oqhtscus0.bkt.clouddn.com/57d8e10760e2ca6a264f235ba6532d27.jpg)

经过测试，发现两种方式打包后的体积都为 21 k，第二种方式仍然将`整个包`引入项目中了。可是 lodash 就是这么玩的呀，这和说好的不一样呀，难道是忽视了什么细节么。

下文就来揭开面纱，并动手改造项目，最终目标是用第二种写法实现按需加载，减小打包体积。

### 按需加载的方案

按需加载的效果是最终打包的代码里没有未引入的模块，从而优化项目体积。下面给出 3 种可以按需加载的方案。

#### 给每个函数单独发布 npm 模块

按需加载的方案一是将每个函数都单独发布一个包，可以在 npm 上查阅 [lodash](https://www.npmjs.com/search?q=lodash)，这种引用方式如下：

```js
import { isEqual } from 'lodash.isequal'
```

#### 每一个函数都作为一个单一的模块导出

按需加载的方案二是将每一个函数都作为一个单一的模块导出，参照这种思路将 [diana](https://github.com/MuYunyun/diana) 的每个函数暴露在 lib 目录下，部分截图如下：

![](http://oqhtscus0.bkt.clouddn.com/fe6032d2fc8169d21162350df63b4907.jpg-200)

这时候再来测试下打包体积：

```js
import equal from 'diana/lib/equal'
```

打包体积结果如下：

![](http://oqhtscus0.bkt.clouddn.com/45f21d4f858962dbfe423c358acbace3.jpg)

可以看到打包体积减小约为原来的 1/7 了，但是这种方案在写法上过于冗长，那要不借助下 babel ？

### 方案二 + babel

方案三是在方案二的基础上借助 [babel 插件](https://github.com/demos-platform/babel-plugin-on-demand-loading)后，写法可以如下:

```js
import { equal } from 'diana'
```

在 `.babelrc` 里进行如下配置:

```js
// .babelrc
{
  "plugins": [
    ["on-demand-loading", {"library": "diana"}]
  ]
}
```

此时打包体积如下：

![](http://oqhtscus0.bkt.clouddn.com/d1bca6090e03924a6a565570bde84c66.jpg)

实际上，[babel 插件](https://github.com/demos-platform/babel-plugin-on-demand-loading) 的作用是将 `import { equal } from 'diana'` 编译成 `import equal from 'diana/lib/equal'`。

关于 babel 插件执行机制，可以在[babel执行机制](https://github.com/MuYunyun/blog/blob/master/BasicSkill/番外篇/babel执行机制.md)中探讨，这里先不展开了。