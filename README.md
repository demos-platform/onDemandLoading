### Purpose

为了确认引用方式是否会导致打包体积变小，此项目对下面两种引用 [diana](https://github.com/MuYunyun/diana/tree/0.4.5) 的方式的打包体积进行相关测试。

### Test results

测试用例一：全局引用

```js
import * as _ from 'diana'
```

测试用例二：引用单个模块

```js
import { isEqual } from 'diana'
```

经过测试，发现两种方式打包后的体积都为 17 k，相当于都把整个包拉下来了 o(╯□╰)o，
那么 lodash 的按需加载又是如何做到减小体积的呢？

### 按需加载

下面给出 3 种可以按需加载的方案。

#### 方案一：给每个函数单独发布 npm 模块

lodash 给每个函数都单独发布了一个包，可以查阅 [npm](https://www.npmjs.com/search?q=lodash)，这种引用方式如下：

```js
import { isEqual } from 'lodash.isequal'
```

#### 方案二：单独引用库里的函数

node_modules 中 lodash 部分截图如下图所示：

![](http://oqhtscus0.bkt.clouddn.com/07af0d9716ccceabc3094e08f78497e3.jpg-200)

lodash 给每个函数分别打包，因此下述引用方式也可以做到按需加载：

```js
import { isEqual } from 'lodash/isEqual'
```

而 [diana](https://github.com/MuYunyun/diana/tree/0.4.5) 是把所有函数都打成一个包了，所以不管怎么引用它，体积都不会减小。

### 方案三：借助 babel

这种方案和第二种方案是相同的，其借助 babel 的特性将如下写法转为方案二的写法：

```js
import { isEqual } from 'lodash'

// babel 会将其转化成下面这种形式

import { isEqual } from 'lodash/isEqual'
```

### todo

- [ ] 将 diana 的函数进行拆分打包
- [ ] 实现相应的按需加载 babel 插件