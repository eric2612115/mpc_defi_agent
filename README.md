# AI Trading Assistant

一个基于Web3和AI的加密货币交易助手，提供自然语言交互、安全分析和智能交易执行功能。

## 环境设置

### 前端设置

1. **创建环境变量文件**

   创建一个名为`.env.local`的文件在项目根目录，添加以下内容：

   ```
   # API配置
   NEXT_PUBLIC_API_URL=http://0.0.0.0:8000
   NEXT_PUBLIC_WS_URL=ws://0.0.0.0:8000/ws

   # 开发模式配置
   NEXT_PUBLIC_DEVELOPMENT_MODE=true
   ```

   在生产环境中，应该将`NEXT_PUBLIC_DEVELOPMENT_MODE`设置为`false`。

2. **安装依赖**

   ```bash
   npm install
   # 或
   yarn
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   # 或
   yarn dev
   ```

### 后端设置

1. **安装Python依赖**

   ```bash
   pip install -r requirements.txt
   ```

2. **启动后端服务器**

   ```bash
   python main.py
   ```

## 开发模式

在开发模式下，前端会绕过代理创建流程，即使后端没有运行，也可以访问所有页面。这可以通过设置环境变量`NEXT_PUBLIC_DEVELOPMENT_MODE=true`来启用。

## API路由

- `GET /api/agent-status/:address` - 检查用户的代理状态
- `POST /api/agent` - 创建新的AI代理
- `GET /api/messages` - 获取用户的消息历史
- `POST /api/deploy-multisig` - 部署多签钱包
- `POST /api/user-signature` - 用户提交交易签名
- `POST /api/user-reject-transaction` - 用户拒绝交易

## 项目结构

- `app/` - Next.js应用页面
  - `api/` - API路由处理程序
  - `assets/` - 资产管理页面
  - `daily-analysis/` - 每日分析页面
  - `about/` - 关于页面
- `components/` - React组件
  - `layout/` - 布局组件
  - `common/` - 通用组件
  - `portfolio/` - 投资组合相关组件
  - `analysis/` - 分析相关组件
- `lib/` - 工具函数和API客户端
- `public/` - 静态资源
- `styles/` - 全局样式

## 故障排除

如果遇到API连接问题：

1. 确保后端服务器正在运行
2. 检查`.env.local`中的API_URL是否正确
3. 查看浏览器控制台是否有CORS错误
4. 在开发模式下，可以设置`NEXT_PUBLIC_DEVELOPMENT_MODE=true`以绕过API检查

## 主要功能

- AI对话界面
- 投资组合分析和管理
- 每日市场分析
- 基于MPC的安全交易执行