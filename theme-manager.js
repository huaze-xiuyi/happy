/**
 * 主题管理器 - 深色模式切换
 * 支持 localStorage 持久化
 */

class ThemeManager {
  constructor() {
    this.THEME_KEY = 'xf-theme-preference';
    this.DARK_THEME = 'dark';
    this.LIGHT_THEME = 'light';
    this.init();
  }

  /**
   * 初始化主题系统
   */
  init() {
    // 获取保存的主题偏好或使用系统默认值
    const saved = this.getSavedTheme();
    const preferred = saved || this.getSystemPreference();
    this.setTheme(preferred);

    // 监听系统主题变化
    this.watchSystemPreference();
  }

  /**
   * 从 localStorage 获取保存的主题
   */
  getSavedTheme() {
    try {
      return localStorage.getItem(this.THEME_KEY);
    } catch (e) {
      console.warn('localStorage not available:', e);
      return null;
    }
  }

  /**
   * 获取系统主题偏好（light/dark）
   */
  getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.DARK_THEME;
    }
    return this.LIGHT_THEME;
  }

  /**
   * 监听系统主题变化
   */
  watchSystemPreference() {
    if (!window.matchMedia) return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
      // 仅当用户未手动设置主题时才自动切换
      if (!this.getSavedTheme()) {
        this.setTheme(e.matches ? this.DARK_THEME : this.LIGHT_THEME);
      }
    });
  }

  /**
   * 设置主题
   * @param {string} theme - 'light' 或 'dark'
   * @param {boolean} save - 是否保存到 localStorage
   */
  setTheme(theme, save = false) {
    const validTheme = [this.DARK_THEME, this.LIGHT_THEME].includes(theme)
      ? theme
      : this.LIGHT_THEME;

    // 设置 HTML 属性
    document.documentElement.setAttribute('data-theme', validTheme);

    // 保存用户偏好
    if (save) {
      try {
        localStorage.setItem(this.THEME_KEY, validTheme);
      } catch (e) {
        console.warn('Failed to save theme preference:', e);
      }
    }

    // 触发自定义事件
    this.dispatchThemeChange(validTheme);

    return validTheme;
  }

  /**
   * 切换主题
   */
  toggleTheme() {
    const current = this.getCurrentTheme();
    const next = current === this.LIGHT_THEME ? this.DARK_THEME : this.LIGHT_THEME;
    return this.setTheme(next, true);
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || this.LIGHT_THEME;
  }

  /**
   * 判断是否为深色模式
   */
  isDark() {
    return this.getCurrentTheme() === this.DARK_THEME;
  }

  /**
   * 触发主题变化事件
   */
  dispatchThemeChange(theme) {
    const event = new CustomEvent('theme-changed', {
      detail: { theme },
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  /**
   * 清除保存的主题偏好（恢复跟随系统）
   */
  clearSavedPreference() {
    try {
      localStorage.removeItem(this.THEME_KEY);
      const systemTheme = this.getSystemPreference();
      this.setTheme(systemTheme);
    } catch (e) {
      console.warn('Failed to clear theme preference:', e);
    }
  }
}

// 创建全局实例
const themeManager = new ThemeManager();

// 为页面上的主题切换按钮绑定事件
document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.theme-toggle, [data-theme-toggle]');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newTheme = themeManager.toggleTheme();

      // 更新按钮图标（可选）
      updateThemeIcon(btn, newTheme);

      // 播放过渡动画（可选）
      playThemeTransition();
    });
  });

  // 初始化图标
  const toggleButtons2 = document.querySelectorAll('.theme-toggle, [data-theme-toggle]');
  toggleButtons2.forEach(btn => {
    updateThemeIcon(btn, themeManager.getCurrentTheme());
  });
});

/**
 * 更新主题切换按钮图标
 */
function updateThemeIcon(button, theme) {
  if (theme === 'dark') {
    button.innerHTML = '☀️';
    button.setAttribute('title', '切换到浅色模式');
    button.setAttribute('aria-label', '切换到浅色模式');
  } else {
    button.innerHTML = '🌙';
    button.setAttribute('title', '切换到深色模式');
    button.setAttribute('aria-label', '切换到深色模式');
  }
}

/**
 * 播放主题切换过渡动画
 */
function playThemeTransition() {
  // 添加过渡效果类
  document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';

  // 短暂延迟后移除过渡（防止后续更改也有动画）
  setTimeout(() => {
    document.documentElement.style.transition = '';
  }, 300);
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = themeManager;
}
