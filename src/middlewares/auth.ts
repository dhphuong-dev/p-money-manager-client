import { ELocalStorage } from '@/constants';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const auth = async (
  from: RouteLocationNormalized,
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const accessToken = localStorage.getItem(ELocalStorage.ACCESS_TOKEN);
  if (from.name === 'Login' && accessToken) {
    return next();
  }

  if (from.meta.requiresAuth) {
    if (accessToken) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  } else {
    next();
  }
};
