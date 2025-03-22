# 3D Spirograph

这是一个基于Three.js的3D旋轮线(Spirograph)可视化项目，它允许您实时调整各种参数并查看生成的3D旋轮线形状。

## 功能

- 创建动态的3D旋轮线
- 实时调整参数（内外圆半径、偏移、高度等）
- 动画展示旋轮线的绘制过程
- 展示内齿轮的运动

## 技术栈

- JavaScript (ES6+)
- Three.js 用于3D渲染
- Express.js 用于本地开发服务器

## 开始使用

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3001 上启动。

## 项目结构

```
3d-spirograph/
├── src/
│   ├── app.js                # 应用程序入口点
│   ├── math/                 # 数学计算
│   │   └── SpirographEquations.js
│   ├── public/               # 公共资源
│   │   ├── index.html
│   │   └── styles/
│   ├── render/               # 渲染相关
│   │   ├── Renderer.js
│   │   └── Scene.js
│   ├── server/               # 服务器
│   │   └── server.js
│   ├── spirograph/           # 旋轮线控制器
│   │   └── SpirographController.js
│   ├── ui/                   # 用户界面
│   │   └── UIPanel.js
│   └── utils/                # 工具函数
│       └── ThreeLoader.js
├── package.json
└── server.js                 # 兼容性入口
```

## 参数说明

- **Outer Radius**: 外齿轮半径
- **Inner Radius**: 内齿轮半径
- **Pen Offset**: 画笔偏移量
- **Height Amplitude**: 高度振幅（Z轴）
- **Animation Speed**: 动画速度

## 许可

MIT
