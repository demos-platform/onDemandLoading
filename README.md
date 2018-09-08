### 引用实验

为了探究全量引用以及部分引用两种不同的引用方式对打出的包体积是否有影响，选择了对先前造的轮子 [diana](https://github.com/MuYunyun/diana) 进行实验。

#### 全量引用

```js
import * as _ from 'diana'
```

打包体积结果如下：

![](http://oqhtscus0.bkt.clouddn.com/6de21bdb4cd2ac1d52a6e2af839ddeb0.jpg)

> 测试的是 [diana 0.4.1](https://github.com/MuYunyun/diana/tree/v0.4.1/lib)

#### 部分引用

```js
import { equal } from 'diana'
```

打包体积结果如下：

![](http://oqhtscus0.bkt.clouddn.com/57d8e10760e2ca6a264f235ba6532d27.jpg)

经过测试，发现两种方式打包后的体积都为 21 k，相当于两种引用方式都把`整个包`引入项目中了。下文就来动手改造项目，目标是引用能实现按需加载。

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

![](http://oqhtscus0.bkt.clouddn.com/57424867319a02734bb1ab80deedea5c.jpg)

可以看到打包体积减小为原来的 1/5 了，但是这种方案的写法过于冗长，借助下 babel 呗。

### 方案二 + babel

方案三是在方案二的基础上借助 [babel 插件](https://github.com/demos-platform/babel-plugin-on-demand-loading)后，写法可以如下:

```js
import { equal } from 'diana'
```

babel 会将上述语句编译成 `import equal from 'diana/lib/equal'`

关于 babel 插件执行机制，未完待续。。。