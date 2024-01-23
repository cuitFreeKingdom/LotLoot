[TOC]

# 项目规范

## 协作模式

协助利用 gitflow 模型，sourcetree 可视化工具进行协作

具体模型参考文件

> \doc\DMS_DOC\团队协作\Git 之 GitFlow 工作流.html

## 资料共享模式

根目录下的 readme 如需更改先给我说一下

doc 下属于自己的目录随便修改

### 错误的提交

TIP:若修改的部分是自己的目录不涉及到公共部分，可以不按照 gitflow 的模型，直接修改 devlop 分支然后合并到 master 分支然后推送就可以了。

1.绕过 develop 分支而直接修改了 master 分支内容

正确的方式应该是在 sourcetree 中利用 flow 模型的快捷操作模式（git 工作流）进行提交

![image-20231228002833977](img/image-20231228002833977.png)

提交顺序属于自己的 feature 分支->develop 分支->release 分支->master 分支

2.feature 分支和 release 分支不要提交到仓库上，在完成一个功能的开发后，在本地根据 souretree 的快捷键完成 devlop->feature->release->(此时在 release 分支上使用快捷键，souretree 会自动将 release 分支上的更新同时更新到 master 和 devlop 分支上并自动删除 release 分支)。所以最后推送到线上的分支只剩下 master 分支和 devlop 分支

![image-20240101155949786](img/image-20240101155949786.png)

## 目录树（根据项目进度持续更新）

doc->用于保存文档

**注意事项**

```
1.markdown 引用的图片统一存放在md文件所在目录下的img里面 (统一一下不然后面目录可能出问题
2.创建目录之后尽可能的写README文档,特别是一些工程文件的启动方法等。
```

# hackthon 资料

[1.Arweave 亚洲 Hackthon 视频](https://www.bilibili.com/video/BV1se411d7mK/?spm_id_from=333.337.search-card.all.click&vd_source=64bfabbf3acac36984d9c1de9d632975)

2.[demo 项目](https://github.com/wangshouh/EIP7527)

3.[wrap 生命周期](https://hackmd.io/@wongssh/AgentWrap)

4.[项目方宣讲录屏](https://pan.baidu.com/s/1djVDixRaE5bBsRi1LZxZWw?pwd=9aee)

## 主办方资料

[Link1](https://ethereum-magicians.org/t/erc-7527-token-bound-function-oracle-amm-contract/15950)

[Link2](https://github.com/ethereum/ERCs/pull/70/files#diff-4d79c38c79c9f9302f58ffa038c5d84d3d574cc8e7b00b90d44c4d7d8a8bcd02)

![8M${AR7GO`OL4~1[]~UF4ZY_tmb](img/8M$%7BAR7GO%60OL41%5B%5DUF4ZY_tmb.jpg)

![1V1IEJ%@AW$CY7U613{0@IN_tmb](img/1V1IEJ%25@AW$CY7U613%7B0@IN_tmb.jpg)

## park

[仓库地址](https://github.com/WeDAOLabs/ParkingSpaceBattle.git)

[试玩地址](https://lotloot.osairo.xyz)

[创新玩法](https://gitee.com/du-mingsong/warp-hack-thon/tree/master/doc/DMS_DOC/park/现有规则的一点思考.md)

# 任务进度及分工情况

## 分工情况

大家先把自己的资料放在这个位置，方便做 ppt 的同学使用（统一格式，白底照片）

### 个人介绍

**杜明松**:

<img src="img/IMG_7848%EF%BC%88%E7%99%BD%EF%BC%89.JPG" alt="IMG_7848（白）" style="zoom:25%;" />

全栈系统工程师，成都信息工程大学前区块链创新开发实验室成员，Async Lab 实验室成员，擅长 web 构建及渗透，在校期间和小伙伴们一起获第十七届四川大学生计算机作品赛特等奖，第十五届全国大学生信息安全竞赛三等奖，第十七届泛珠三角+大学生计算机作品赛总决赛三等奖等奖项，具有丰富的项目管理经验。

**万艳**：

<img src="img/万艳.JPG" alt="万艳" style="zoom:25%;" />

UI 设计，软件工程专业在读，熟悉软件项目管理流程。有丰富的 UI 设计经验，参与并主导 4 个项目的需求分析与原型设计工作。2020 至 2021 年度国家奖学金获得者，有敏锐的商业头脑，多次在创新创业大赛中取得成绩。

**陈思达**:

<img src="img/陈思达.jpg" alt="陈思达" style="zoom:50%;" />

后端/合约工程师，区块链工程专业在读，校内区块链信创实验室成员，校内 Async Lab 实验室成员，校内区块链智能治理社区成员。擅长 Go 语言后端开发工作，对于 Solidity 开发也比较了解。曾获四川省区块链技术创新应用大赛应用组一等奖，浙江大学第三届链坊杯 gamefi / NFT 赛道三等奖。

**亓祺**:

<img src="img/MG0700.jpg" alt="亓祺" style="zoom:50%;width:600px" />

前端工程师，软件工程专业在读，校内 Loop 实验室成员。熟悉软件开发测试流程，擅长 JavaScript 语言开发工作，对于 Web3 开发较为了解。曾参与并主导开发多个软件项目的开发，具有丰富的软件开发经验。

**张力子**：

<img src="img/张力子.jpg" alt="张力子" style="zoom:13%;">

前端/智能合约工程师，区块链工程专业在读，成都信息工程大学区块链网络安全中心成员。擅长 Vue.js 框架、Solidity、Java 语言。具备较强创新能力、项目设计能力，具有项目开发管理经验，丰富大赛经验。曾获大学生互联网+铜奖，四川区块链职业技能大赛优秀案例等奖项。

**章茗茜**：

<img src="img/章茗茜.jpeg" alt="章茗茜" style="zoom:50%;width:600px">

智能合约工程师，区块链工程专业在读，成都信息工程大学区块链网络安全中心成员。擅长 solidity 语言，具有基于以太坊的智能合约开发能力，了解脚本语言 python、JavaScript，了解常见的智能合约漏洞原理及其修复方式，有合约审计相关经验。曾获第二届中国可信区块链安全攻防大赛三等奖等奖项。

**周正**：

<img src="img/zz头像.jpeg" alt="周正" style="zoom:50%;width:600px">

智能合约工程师，区块链工程专业在读，成都信息工程大学区块链协会创始人之一。了解 solidity，JS，python 爬虫，逆向等技术，有合约开发经验，了解合约基本漏洞及其修复，以及复现过 UniswapV2，opensea 等以太坊知名项目源码。曾获 eth 杭州 L2 赛道第二名，miniHack house 第三名。

## 任务进度

第一阶段

从现在开始，大家先开始学习，在本地进行 demo 实验但是不上仓库，偶尔开个会讨论一下。在大家感觉学的差不多了可以开始的时候在开始分工然后进入开发阶段，ppt 预计在第一阶段的中后期开始做（ppt 模板选择和类似团队介绍这种部分可以在此时开始搞）

![image-20240101195631446](img/image-20240101195631446.png)

# 激励分配

现在的初步想法是分为开发组和产品组

开发组主要负责系统开发和实现，协作产品组完成工作

产品组主要负责 PPT，文档编写，原型图等工作

项目无保底，比赛奖金作为唯一资金来源，开发组和产品组各分得一定权重，组内再按照贡献分出不同的权重分成（开发组的 commit 情况作为分配标准之一）

## 经济模型

1.车辆 freeMint，但是初始用户，但是需不需要通过质押的方式让用户直接氪金获得我们的代币去购买我们的 nft

2.定价函数的确定（价格到达一定上线之后大部分玩家以差不多的价格买入配件的 nft

3.可组合的 nft
