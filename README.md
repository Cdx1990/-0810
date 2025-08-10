# 受限访问网站

本项目提供一个示例网站：
- 首页对外公开，可被搜索引擎索引；
- 受限页面仅允许用户名 `qazwsx1995` 登录后访问；
- 提供 `robots.txt` 与 `sitemap.xml`，方便搜索引擎发现站点。

## 本地运行

1. 复制环境变量文件：

```bash
cp .env.example .env
# 请修改 SESSION_SECRET 与 APP_PASSWORD
```

2. 安装依赖并启动：

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

## 登录说明
- 用户名固定为 `qazwsx1995`；
- 密码来自环境变量 `APP_PASSWORD`；
- 登录成功后访问 `/secure`；退出使用首页上的“退出登录”。

## 部署
### 方式一：Docker

```bash
docker build -t restricted-webpage .
docker run -d -p 3000:3000 \
  -e SESSION_SECRET=your_session_secret \
  -e APP_PASSWORD=your_strong_password \
  -e SITE_URL=https://your-domain.com \
  --name restricted restricted-webpage
```

### 方式二：Node 直接运行

```bash
npm ci
SESSION_SECRET=your_session_secret \
APP_PASSWORD=your_strong_password \
SITE_URL=https://your-domain.com \
NODE_ENV=production npm start
```

## SEO
- 首页包含基础 SEO meta 信息；
- `/robots.txt` 允许索引首页并指向 `/sitemap.xml`；
- `/secure` 设置 `noindex`，不会被搜索引擎收录。
