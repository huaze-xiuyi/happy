/**
 * ============================================================================
 * 幸福生态平台 - 共享工具函数库
 * ============================================================================
 */

// ============================================================================
// 导航管理
// ============================================================================

class Navigation {
  static init() {
    this.initNavigation();
    this.initSidebar();
  }

  static initNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav a, .sidebar-menu a');
    const currentFile = this.getCurrentPageFile();

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === currentFile || (currentFile === 'index.html' && (href === '' || href === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }

  static initSidebar() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        sidebar?.classList.toggle('active');
      });
    }

    // 点击主容器关闭侧边栏
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.sidebar') && !e.target.closest('#sidebar-toggle')) {
        sidebar?.classList.remove('active');
      }
    });
  }

  static getCurrentPageFile() {
    const href = window.location.href;
    const file = href.split('/').pop() || 'index.html';
    return file;
  }

  static getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('shop')) return 'shop';
    if (path.includes('shanghai')) return 'shanghai';
    if (path.includes('happiness')) return 'happiness';
    return 'index';
  }
}

// ============================================================================
// 标签页管理
// ============================================================================

class TabManager {
  constructor(tabContainerId, contentContainerId) {
    this.tabContainer = document.getElementById(tabContainerId);
    this.contentContainer = document.getElementById(contentContainerId);
    this.init();
  }

  init() {
    if (!this.tabContainer) return;

    const tabButtons = this.tabContainer.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabId = button.getAttribute('data-tab');
        this.switchTab(tabId);
      });
    });

    // 激活第一个标签
    const firstBtn = tabButtons[0];
    if (firstBtn) {
      const firstTabId = firstBtn.getAttribute('data-tab');
      this.switchTab(firstTabId);
    }
  }

  switchTab(tabId) {
    // 隐藏所有内容
    const allContents = this.contentContainer.querySelectorAll('.tab-content-item');
    allContents.forEach(content => {
      content.classList.add('hidden');
    });

    // 移除所有按钮的激活状态
    const allButtons = this.tabContainer.querySelectorAll('.tab-btn');
    allButtons.forEach(btn => {
      btn.classList.remove('tab-btn-active');
      btn.classList.add('bg-slate-100', 'hover:bg-slate-200', 'text-slate-700');
    });

    // 显示选中的内容
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
      targetContent.classList.remove('hidden');
      void targetContent.offsetWidth; // 触发重排
    }

    // 激活对应按钮
    const activeButton = this.tabContainer.querySelector(`[data-tab="${tabId}"]`);
    if (activeButton) {
      activeButton.classList.add('tab-btn-active');
      activeButton.classList.remove('bg-slate-100', 'hover:bg-slate-200', 'text-slate-700');
    }
  }
}

// ============================================================================
// 评分系统
// ============================================================================

class ScoreSystem {
  static getScoreClass(score) {
    if (score >= 90) return 'score-a-plus';
    if (score >= 80) return 'score-a';
    if (score >= 70) return 'score-b-plus';
    if (score >= 60) return 'score-b';
    if (score >= 50) return 'score-c';
    return 'score-d';
  }

  static getScoreLabel(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'D';
  }

  static getScoreStatus(score) {
    if (score >= 80) return { text: '优秀', color: 'text-green-600' };
    if (score >= 60) return { text: '良好', color: 'text-blue-600' };
    if (score >= 40) return { text: '中等', color: 'text-yellow-600' };
    return { text: '需改进', color: 'text-red-600' };
  }

  static calculateWeightedScore(scores, weights) {
    let total = 0;
    let weightSum = 0;

    for (let i = 0; i < scores.length; i++) {
      total += scores[i] * weights[i];
      weightSum += weights[i];
    }

    return weightSum > 0 ? total / weightSum : 0;
  }
}

// ============================================================================
// Chart.js 辅助函数
// ============================================================================

class ChartHelper {
  static getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: "'Noto Sans SC', sans-serif", size: 12 },
            color: '#475569',
            padding: 15,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { family: "'Noto Sans SC', sans-serif", size: 13 },
          bodyFont: { family: "'Noto Sans SC', sans-serif", size: 12 },
          padding: 12,
          borderRadius: 8,
          displayColors: true,
        }
      },
      scales: {
        x: {
          ticks: {
            font: { family: "'Noto Sans SC', sans-serif", size: 12 },
            color: '#94a3b8',
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.3)',
            drawBorder: false,
          }
        },
        y: {
          ticks: {
            font: { family: "'Noto Sans SC', sans-serif", size: 12 },
            color: '#94a3b8',
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.3)',
            drawBorder: false,
          }
        }
      }
    };
  }

  static createLineChart(ctx, data, options = {}) {
    const defaultOptions = this.getChartOptions();
    const mergedOptions = { ...defaultOptions, ...options };

    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        ...mergedOptions,
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  static createBarChart(ctx, data, options = {}) {
    const defaultOptions = this.getChartOptions();
    const mergedOptions = { ...defaultOptions, ...options };

    return new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        ...mergedOptions,
        indexAxis: options.indexAxis || 'x'
      }
    });
  }

  static createDoughnutChart(ctx, data, options = {}) {
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: { family: "'Noto Sans SC', sans-serif", size: 12 },
            color: '#475569',
            padding: 15,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { family: "'Noto Sans SC', sans-serif", size: 13 },
          bodyFont: { family: "'Noto Sans SC', sans-serif", size: 12 },
          padding: 12,
          borderRadius: 8,
        }
      }
    };
    const mergedOptions = { ...defaultOptions, ...options };

    return new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: mergedOptions
    });
  }

  static createRadarChart(ctx, data, options = {}) {
    const defaultOptions = this.getChartOptions();
    const mergedOptions = { ...defaultOptions, ...options };

    return new Chart(ctx, {
      type: 'radar',
      data: data,
      options: mergedOptions
    });
  }
}

// ============================================================================
// 数据处理工具
// ============================================================================

class DataProcessor {
  static groupBy(array, key) {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  }

  static filterByField(array, field, value) {
    return array.filter(item => item[field] === value);
  }

  static sumByField(array, field) {
    return array.reduce((sum, item) => sum + (item[field] || 0), 0);
  }

  static averageByField(array, field) {
    if (array.length === 0) return 0;
    return this.sumByField(array, field) / array.length;
  }

  static getDistinct(array, field) {
    return [...new Set(array.map(item => item[field]))];
  }

  static sortBy(array, field, ascending = true) {
    return [...array].sort((a, b) => {
      if (ascending) {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
  }

  static formatNumber(num, decimals = 2) {
    return Number(num).toFixed(decimals);
  }

  static formatPercent(num, decimals = 1) {
    return (num * 100).toFixed(decimals) + '%';
  }

  static formatDate(date, format = 'YYYY-MM-DD') {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }
}

// ============================================================================
// DOM 工具
// ============================================================================

class DOMUtils {
  static createElement(tag, className = '', innerHTML = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
  }

  static show(element) {
    if (element) element.style.display = '';
  }

  static hide(element) {
    if (element) element.style.display = 'none';
  }

  static toggleClass(element, className) {
    if (element) element.classList.toggle(className);
  }

  static addClass(element, ...classNames) {
    if (element) element.classList.add(...classNames);
  }

  static removeClass(element, ...classNames) {
    if (element) element.classList.remove(...classNames);
  }

  static hasClass(element, className) {
    return element?.classList.contains(className) || false;
  }

  static setAttributes(element, attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  static removeElement(selector) {
    const element = document.querySelector(selector);
    element?.remove();
  }

  static findParent(element, className) {
    let current = element;
    while (current) {
      if (current.classList?.contains(className)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }
}

// ============================================================================
// 存储工具
// ============================================================================

class StorageManager {
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static get(key, defaultValue = null) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

// ============================================================================
// 初始化
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  Navigation.init();
});

// 导出（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Navigation,
    TabManager,
    ScoreSystem,
    ChartHelper,
    DataProcessor,
    DOMUtils,
    StorageManager
  };
}
