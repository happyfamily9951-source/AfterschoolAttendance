# After-School Attendance Management System  
_课后班管理系统_

## 🎯 项目简介
本系统是一套基于 **Google Sheets + Google Apps Script + GitHub Pages** 的轻量级教学管理系统，  
用于课后班或教育机构的：
- 学生信息录入与查询  
- 课程创建与查询  
- 出勤登记  
- 学生报名课程  
- 数据重复校验与统计  

系统采用纯前端 HTML/CSS/JS 构建，后端由 Google Apps Script 提供 API 服务，  
无需服务器，无数据库维护成本，部署简单、安全、可快速扩展。

## ⚙️ 技术路线
| 模块 | 技术栈 |
|------|---------|
| 前端 | HTML + CSS + JavaScript (原生 ES6) |
| 后端 | Google Apps Script (doGet / doPost) |
| 数据库 | Google Sheets |
| 交互协议 | `application/x-www-form-urlencoded` |
| 托管 | GitHub Pages |
| 样式主题 | Apple 商务风 (统一 style.css) |


## 🗂️ 文件结构
AfterschoolAttendance/
│
├── index.html # 主页面（功能菜单）
├── StudentEnrollment.html # 学生录入与查询
├── CourseEnrollment.html # 课程创建与查询
├── Attendance.html # 出勤记录
├── StudentCourseApplication.html # 学生报名课程
│
├── config.js # 公共函数库 (API_URL, formatDate, callNumber, smsNumber 等)
├── style.css # 全局样式表
│
├── icons/ # 图标资源
│ ├── logo-monica-linan.svg
│ ├── student.svg
│ ├── attendance.svg
│ ├── course.svg
│ └── home.svg
│
├── AfterSchoolAttendance_ProjectSummary.docx # 项目说明文档
├── README.md # 当前文件
└── CHANGELOG.md # 版本更新日志

## 🚀 功能概述
| 页面 | 功能描述 |
|------|------------|
| **index.html** | 主菜单入口，提供五大功能模块导航。 |
| **StudentEnrollment.html** | 录入学生资料，支持 Accordion 折叠显示学生详情。 |
| **CourseEnrollment.html** | 创建与查询课程，Accordion 展示班级详细信息。 |
| **Attendance.html** | 按班级考勤，支持 LeaveRequest 自动识别。 |
| **StudentCourseApplication.html** | 学生报名课程（选择班级 + 勾选学生）。 |
| **config.js** | 公共函数，包括日期格式化、拨号、短信、全局提示等。 |

## 🔧 安装与部署
1️⃣ **前端部署**  
- 将整个项目上传至 GitHub 仓库  
- 启用 GitHub Pages（main 分支 /root）  
- 前端访问地址示例：  
  `https://happyfamily9951-source.github.io/AfterschoolAttendance`

2️⃣ **后端部署**  
- 打开 Google Apps Script  
- 复制项目代码（doGet/doPost 等函数）  
- 部署为 Web App，权限选择：
  - Execute as: Me  
  - Access: Anyone, even anonymous  
- 复制发布的 Web App URL，在 `config.js` 中设置：  
  ```js
  const API_URL = "https://script.google.com/macros/s/xxxxxx/exec";

3️⃣ **测试连接**  
在浏览器控制台运行 fetch(API_URL + "?action=ping")
若返回 JSON 数据，即连接成功。

## 📦 打包说明（Baseline）
**版本基线（Baseline）结构如下**
AfterSchoolAttendance_Baseline_2025-10-06/
│
├── [全部 HTML / JS / CSS 文件]
├── icons/
├── AfterSchoolAttendance_ProjectSummary.docx
├── README.md
└── CHANGELOG.md

**发布新版本时**
1. 更新版本号与日期；
2. 打包成 ZIP；
3. 上传至 GitHub Release；
4. 命名规则：
  AfterSchoolAttendance_Baseline_YYYYMMDD.zip

## 💡 联系与维护
作者: Monica & Linan
维护邮箱: happyfamily9951@gmail.com
当前版本: v1.0.0 (2025-10-06)

## 特别说明
本人仅具备基本电脑操作技能，第一次接触编写 HTML, JS, CSS, Apps Scripts 等功能。
全程借助 ChatGPT 完成。
特此鸣谢家人支持
