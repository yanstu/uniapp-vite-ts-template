import { Navigates } from '@/utils/router/navigates';
import { pages } from '@/pages.json';

/**
 * 需要验证登录的路径
 * 包括分包(subPackage)的路径
 */
export const AUTH_PAGE: string[] = (() => {
  let urls: string[] = [];
  for (let page of pages) {
    page.needLogin && urls.push(page.path);
  }
  return urls;
})();

export const router = new Navigates();
