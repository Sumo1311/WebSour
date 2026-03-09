# Web Companion - 交互式陪伴插件

一个可嵌入任意网页的交互式陪伴插件，提供可爱的角色陪伴用户浏览网页。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ 功能特性

### 核心功能
- 🎭 **多种角色风格**：提供小猫、圆周率 π、求和 Σ、无穷 ∞ 四种可爱角色
- 🖱️ **眼睛跟随**：实时追踪鼠标位置，实现自然的视觉交互
- 🚶 **随机漫游**：角色在整个视窗范围内自由移动
- 🎯 **智能边界**：自动检测页面边界，防止角色超出视窗
- 🎨 **缓动曲线**：采用 ease-in-out 缓动函数，移动更自然流畅
- ⏸️ **周期性停顿**：移动一段时间后自动停顿，模拟真实生物行为

### 高级功能
- 💥 **点击破裂**：点击角色会触发破裂效果，播放音效并显示 +1
- ⏰ **自动重生**：角色破裂后 10 秒倒计时，自动在随机位置重生
- 👥 **多角色管理**：支持同时添加多个角色（最多 10 个），每个角色独立运行
- 🌈 **路径模式**：随机选择直线或弧线运动，增加移动趣味性
- 🎊 **粒子效果**：破裂时产生四散的粒子动画
- 🎮 **交互反馈**：鼠标悬停时角色放大并显示阴影效果

### 性能优化
- ⚡ **高性能渲染**：使用 CSS transform 代替 left/top，避免布局重排
- 📊 **实时监控**：内置 FPS 监控面板，实时显示性能数据
- 🎯 **帧率保证**：确保≥30fps，10 角色场景下仍保持 40-45fps
- 💾 **内存优化**：内存增长≤10%，长时间运行稳定

## 🚀 快速开始

### 1. 基础使用

```html
<!-- 引入插件 -->
<script src="dist/companion.js"></script>

<!-- 初始化插件 -->
<script>
  const companion = initWebCompanion({
    style: 'cat',              // 角色风格：'cat', 'pi', 'sigma', 'infinity'
    size: 80,                  // 角色大小（像素）
    eyeSensitivity: 0.5,       // 眼睛跟随灵敏度（0.1-1）
    moveDuration: 3000,        // 移动时长（毫秒）
    pauseDuration: 2000,       // 停顿时长（毫秒）
    respawnTime: 10000,        // 重生时间（毫秒）
    soundEnabled: true         // 是否启用音效
  });
</script>
```

### 2. 多角色管理

```javascript
// 添加多个角色
const companion1 = initWebCompanion({ style: 'cat' });
const companion2 = initWebCompanion({ style: 'pi' });
const companion3 = initWebCompanion({ style: 'sigma' });

// 获取当前角色数量
const count = WebCompanion.getTotalCount();
console.log('当前角色数量：', count);

// 检查是否可以添加新角色
if (WebCompanion.canAddCompanion()) {
  initWebCompanion({ style: 'infinity' });
}

// 移除所有角色
WebCompanion.destroyAll();
```

### 3. 角色控制

```javascript
// 创建角色实例
const companion = new WebCompanion({
  style: 'cat',
  size: 100
});

// 获取性能指标
const metrics = WebCompanion.getPerformanceMetrics();
console.log('FPS:', metrics.fps);
console.log('角色数量：', metrics.companionCount);

// 销毁单个角色
companion.destroy();
```

## 🎨 角色风格

| 风格 | 名称 | 描述 |
|------|------|------|
| `cat` | 小猫 | 经典可爱的小猫形象，带有耳朵和胡须 |
| `pi` | 圆周率 | 数学智慧的象征，带有闪烁效果 |
| `sigma` | 求和 | 集合与累加的艺术，带有光环效果 |
| `infinity` | 无穷 | 无限可能的代表，带有旋转轨道 |

## 📊 性能指标

### 帧率表现
- **单角色运行**：58-60 FPS
- **5 个角色同时运行**：50-55 FPS
- **10 个角色同时运行**：40-45 FPS

### 内存占用
- **单角色初始内存**：~2.2 MB
- **10 个角色内存**：~19.8 MB
- **内存增长**：≤ 10%

## 🛠️ 开发与构建

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `dist/` 目录。

### 本地测试

```bash
# 启动本地服务器
python3 -m http.server 8080

# 访问 http://localhost:8080
```

## 📁 项目结构

```
web-sour/
├── src/                    # 源代码目录
│   ├── companion.js        # 核心插件逻辑
│   └── companion.css       # 样式文件
├── dist/                   # 构建输出目录
│   ├── companion.js        # 未压缩版本
│   └── companion.min.js    # 压缩版本
├── scripts/                # 构建脚本
│   └── build.js            # 构建配置
├── index.html              # 演示页面
├── package.json            # 项目配置
├── PERFORMANCE_REPORT.md   # 性能测试报告
└── README.md               # 项目文档
```

## 🎯 API 文档

### 构造函数选项

```javascript
{
  style?: 'cat' | 'pi' | 'sigma' | 'infinity'  // 角色风格，默认：'cat'
  size?: number                                // 角色大小，默认：80
  eyeSensitivity?: number                      // 眼睛灵敏度，默认：0.5
  roamArea?: 'viewport' | string               // 漫游区域，默认：'viewport'
  moveDuration?: number                        // 移动时长 (ms)，默认：3000
  pauseDuration?: number                       // 停顿时长 (ms)，默认：2000
  respawnTime?: number                         // 重生时间 (ms)，默认：10000
  soundEnabled?: boolean                       // 是否启用音效，默认：true
}
```

### 静态方法

```javascript
// 获取当前角色总数
WebCompanion.getTotalCount(): number

// 检查是否可以添加新角色
WebCompanion.canAddCompanion(): boolean

// 获取最大角色数量
WebCompanion.getMaxCount(): number

// 销毁所有角色
WebCompanion.destroyAll(): void

// 获取性能指标
WebCompanion.getPerformanceMetrics(): { fps: number, companionCount: number }
```

### 实例方法

```javascript
// 销毁单个角色
companion.destroy(): void
```

## 🔧 自定义样式

可以通过 CSS 自定义角色外观：

```css
/* 自定义小猫颜色 */
.web-companion.style-cat .companion-face {
  background: linear-gradient(135deg, #your-color 0%, #your-color2 100%);
}

/* 自定义大小 */
.web-companion {
  transform: scale(1.2);
}

/* 隐藏性能面板 */
.performance-panel {
  display: none;
}
```

## 📝 更新日志

### v1.0.0 (2026-03-09)
- ✨ 实现角色数量限制（最大 10 个）
- ✨ 添加错误提示 Toast 通知
- ✨ 优化界面统计显示
- ✨ 重构动画系统，添加平滑过渡效果
- ✨ 实现鼠标悬停交互反馈
- ✨ 优化性能，使用 transform 代替 left/top
- ✨ 添加实时 FPS 监控面板
- ✨ 确保≥30fps，内存增长≤10%

### v0.9.0 (早期版本)
- 🎭 四种角色风格
- 🖱️ 眼睛跟随功能
- 🚶 随机漫游系统
- 💥 点击破裂效果
- ⏰ 自动重生机制
- 🎵 音效系统

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

**Sumo1311**

GitHub: [@Sumo1311](https://github.com/Sumo1311)

## 🔗 相关链接

- [GitHub 仓库](https://github.com/Sumo1311/WebSour)
- [在线演示](https://sumo1311.github.io/WebSour/)
- [性能测试报告](PERFORMANCE_REPORT.md)

---

**Enjoy coding with your web companions! 🎉**
