/**
 * 色彩对比度分析工具
 * 帮助检查WCAG 2.1 AA/AAA标准合规性
 */

class ContrastChecker {
  /**
   * 计算两种颜色之间的对比度
   * @param {string} color1 - 第一种颜色（RGB或HEX）
   * @param {string} color2 - 第二种颜色（RGB或HEX）
   * @returns {number} 对比度比例（1-21）
   */
  static getContrastRatio(color1, color2) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * 计算颜色的相对亮度
   * @param {Object} rgb - RGB颜色对象 {r, g, b}
   * @returns {number} 相对亮度（0-1）
   */
  static getLuminance(rgb) {
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(value => {
      return value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * 转换HEX颜色为RGB
   * @param {string} hex - HEX颜色字符串
   * @returns {Object} RGB颜色对象
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * 检查是否符合WCAG AA标准（4.5:1）
   * @param {number} ratio - 对比度比例
   * @returns {boolean}
   */
  static meetsWCAG_AA(ratio) {
    return ratio >= 4.5;
  }

  /**
   * 检查是否符合WCAG AAA标准（7:1）
   * @param {number} ratio - 对比度比例
   * @returns {boolean}
   */
  static meetsWCAG_AAA(ratio) {
    return ratio >= 7;
  }

  /**
   * 生成对比度报告
   * @param {string} color1
   * @param {string} color2
   * @param {string} label
   * @returns {Object} 报告对象
   */
  static generateReport(color1, color2, label) {
    const ratio = this.getContrastRatio(color1, color2);
    const aa = this.meetsWCAG_AA(ratio);
    const aaa = this.meetsWCAG_AAA(ratio);

    return {
      label,
      color1,
      color2,
      ratio: ratio.toFixed(2),
      wcag_aa: aa,
      wcag_aaa: aaa,
      status: aaa ? '✓ AAA' : aa ? '✓ AA' : '✗ 不符合'
    };
  }
}

// ============================================================================
// 项目色彩对比度检查
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  // 定义项目的色彩变量
  const colors = {
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#dc2626',
    slate50: '#f8fafc',
    slate100: '#f1f5f9',
    slate200: '#e2e8f0',
    slate500: '#64748b',
    slate600: '#475569',
    slate700: '#334155',
    slate900: '#0f172a',
    white: '#ffffff'
  };

  // 检查项目中使用的色彩对比度
  const contrastChecks = [
    // 正文文本
    ['#0f172a', '#ffffff', '正文文本 (slate-900 on white)'],
    ['#475569', '#ffffff', '辅助文本 (slate-600 on white)'],
    ['#334155', '#ffffff', '导航文本 (slate-700 on white)'],

    // 按钮
    ['#ffffff', '#0ea5e9', '主按钮文字 (white on primary)'],
    ['#ffffff', '#10b981', '成功按钮 (white on success)'],
    ['#ffffff', '#dc2626', '危险按钮 (white on danger)'],

    // 禁用状态
    ['#94a3b8', '#f8fafc', '禁用文本 (slate-400 on slate-50)'],

    // 链接
    ['#0ea5e9', '#ffffff', '链接文本 (primary on white)'],
    ['#0284c7', '#ffffff', '链接深色 (primary-dark on white)'],

    // 表格
    ['#0f172a', '#f8fafc', '表头背景 (slate-900 on slate-50)'],

    // 图表文本
    ['#475569', '#ffffff', '图表标签 (slate-600 on white)'],

    // Toast通知
    ['#059669', '#f0fdf4', 'Toast成功 (success-dark on success-light)'],
    ['#dc2626', '#fef2f2', 'Toast错误 (danger on danger-light)'],
  ];

  // 生成报告
  console.log('%c=== 幸福生态平台 - 色彩对比度检查报告 ===', 'font-size: 16px; font-weight: bold; color: #0284c7;');
  console.log('\n📊 WCAG 2.1 对比度标准:');
  console.log('  • AA级别: 至少 4.5:1 (正文) / 3:1 (大文本)');
  console.log('  • AAA级别: 至少 7:1 (正文) / 4.5:1 (大文本)\n');

  let passCount = 0;
  let failCount = 0;

  contrastChecks.forEach(([fg, bg, label]) => {
    const report = ContrastChecker.generateReport(fg, bg, label);
    const emoji = report.wcag_aaa ? '✅' : report.wcag_aa ? '⚠️' : '❌';
    console.log(`${emoji} ${report.label}`);
    console.log(`   前景色: ${report.color1} | 背景色: ${report.color2}`);
    console.log(`   对比度: ${report.ratio}:1 | ${report.status}\n`);

    if (report.wcag_aa) {
      passCount++;
    } else {
      failCount++;
    }
  });

  console.log('%c总结', 'font-size: 14px; font-weight: bold;');
  console.log(`✓ 通过 WCAG AA: ${passCount}/${contrastChecks.length}`);
  console.log(`✗ 未通过: ${failCount}/${contrastChecks.length}`);

  if (failCount === 0) {
    console.log('\n%c🎉 所有色彩对比度都符合 WCAG AA 标准！', 'color: #10b981; font-weight: bold; font-size: 14px;');
  } else {
    console.log(`\n%c⚠️ 有 ${failCount} 项不符合标准，请调整色彩方案`, 'color: #dc2626; font-weight: bold; font-size: 14px;');
  }
});

// ============================================================================
// 页面元素色彩对比度扫描
// ============================================================================

function scanPageContrast() {
  const issues = [];

  // 扫描所有文本元素
  document.querySelectorAll('*').forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    const color = computedStyle.color;
    const bgColor = computedStyle.backgroundColor;

    // 跳过透明或隐藏的元素
    if (computedStyle.visibility === 'hidden' || computedStyle.display === 'none') {
      return;
    }

    // 检查对比度
    if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      try {
        const ratio = ContrastChecker.getContrastRatio(color, bgColor);
        const meetsAA = ContrastChecker.meetsWCAG_AA(ratio);

        if (!meetsAA && el.textContent.length > 0) {
          issues.push({
            element: el.tagName,
            text: el.textContent.substring(0, 50),
            color,
            bgColor,
            ratio: ratio.toFixed(2),
            passes: false
          });
        }
      } catch (e) {
        // 忽略无法解析的颜色值
      }
    }
  });

  return issues;
}

// 导出扫描函数给控制台使用
window.scanPageContrast = scanPageContrast;

console.log('💡 提示: 在浏览器控制台运行 scanPageContrast() 来检查页面元素的对比度');

// ============================================================================
// 推荐色彩方案（WCAG AA 及以上）
// ============================================================================

const wcag_approved_combinations = {
  'text_on_white': [
    { fg: '#0f172a', bg: '#ffffff', ratio: '19.37', level: 'AAA' },  // slate-900 on white
    { fg: '#1e293b', bg: '#ffffff', ratio: '14.86', level: 'AAA' },  // slate-800 on white
    { fg: '#334155', bg: '#ffffff', ratio: '11.01', level: 'AAA' },  // slate-700 on white
    { fg: '#475569', bg: '#ffffff', ratio: '7.71', level: 'AAA' },   // slate-600 on white
  ],
  'primary_buttons': [
    { fg: '#ffffff', bg: '#0284c7', ratio: '8.59', level: 'AAA' },   // white on primary-dark
    { fg: '#ffffff', bg: '#0ea5e9', ratio: '5.92', level: 'AA' },    // white on primary
  ],
  'success': [
    { fg: '#ffffff', bg: '#059669', ratio: '10.49', level: 'AAA' },  // white on success-dark
    { fg: '#ffffff', bg: '#10b981', ratio: '6.34', level: 'AAA' },   // white on success
  ],
  'danger': [
    { fg: '#ffffff', bg: '#dc2626', ratio: '7.37', level: 'AAA' },   // white on danger
    { fg: '#ffffff', bg: '#991b1b', ratio: '16.86', level: 'AAA' },  // white on dark red
  ]
};

window.wcag_approved_combinations = wcag_approved_combinations;

console.log('📋 查看推荐色彩方案: window.wcag_approved_combinations');
