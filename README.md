# Quest

一款轻量的 Memo 记录程序，基于 Bun + Hono + MongoDB 构建

> 适用于个人笔记、碎片知识记录或通过 Webhook 同步社交媒体内容聚合展示

## 特点

* 极度精简，仅支持 `Markdown` 笔记和标签功能
* 仅支持 API 进行笔记发布、查询、删除等操作，无前端管理后台
* 服务端渲染，SEO 友好

## 截图

![image](./screenshot.png)

## Live Demo

[Demo](https://www.tg.quest)

## 安装依赖

```sh
bun install
```

## 复制并修改配置文件

1. 提前在 MongoDB 中创建好对应的数据库
2. 复制 `.env.example` 为 `.env`
3. 修改 `.env` 中的环境变量

```
# .env
PORT="8848" # 运行端口
MONGO_URI="mongodb://127.0.0.1:27017/quest" # mongoDB 连接地址
JWT_SECRET="your-secret-key" # JWT 密钥，请务必修改
TOKEN_EXPIRE_TIME="0" # API Token 生成有效期
ADMIN_USERNAME="admin" # 获取 Token 用户名
ADMIN_PASSWORD="admin" # 获取 Token 密码
TITLE="Quest" # 标题
SUB_TITLE="A Simple Memo Site" # 副标题标题
DESCRIPTION="Quest your interesting" # 描述
KEYWORDS="Quest, Memo, Simple" # SEO 关键词
INDEX_PAGE_SIZE="10" # 每页展示 Memos 数量
CACHE_SECONDS="3600" # 访问内容服务端缓存
FONT_SCRIPT_URL="https://fonts.googleapis.com/css?family=Mono" # Google 字体地址
UMAMI_URL="https://cloud.umami.is/script.js" # Umami 统计托管地址（留空则不使用）
UMAMI_WEBSITE_ID="" # Umami 统计ID（留空则不使用）
```

## 运行（开发环境）

```sh
# dev
bun run dev

# start
bun run start

# nohup 守护运行
nohup bun run start > output.log 2>&1 & # 退出终端后守护运行，请使用 exit 退出
```

> 访问地址：http://localhost:8848

## API

星号标注接口需要鉴权，采用`JWT`形式鉴权，即需要在请求`header`中添加`Authorization`的值为`Bearer ${token}`。

1. 获取 Token

> [POST] /api/users/token

| 参数名   | 类型   | 必填 | 描述       |
|----------|--------|------|------------|
| name | string | 是   | 用户名     |
| password | string | 是   | 密码       |


2. 获取 Memo 列表

> [POST] /api/memo/list

| 参数名   | 类型   | 必填 | 描述       |
|----------|--------|------|------------|
| size | number | 是   | 每页数量     |
| prev | string | 否   | 上一个 memo 的 id，用于分页加载       |
| tags | array | 是   | 标签       |

3. 创建 Memo

> *[POST] /api/memo/create

| 参数名   | 类型   | 必填 | 描述       |
|----------|--------|------|------------|
| content | string | 是   | 内容     |
| tags | array | 是   | 标签       |

4. 修改 Memo

> *[POST] /api/memo/update

| 参数名   | 类型   | 必填 | 描述       |
|----------|--------|------|------------|
| id | string | 是   | 要修改的 memo 的 id     |
| content | string | 是   | 内容     |
| tags | array | 是   | 标签       |

5. 删除 Memo

> *[POST] /api/memo/delete

| 参数名   | 类型   | 必填 | 描述       |
|----------|--------|------|------------|
| id | string | 是   | 要删除的 memo 的 id     |

## 待办事项

- [ ] 支持 Android / IOS 客户端发布管理内容
- [x] 内容缓存机制
