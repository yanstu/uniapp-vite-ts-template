// 引入express
const express = require('express');
const app = express();

//托管到dist目录(打包)
app.use(express.static('../dist'));

// 导出app实例
module.exports = app;
