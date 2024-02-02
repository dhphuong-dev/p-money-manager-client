import { useAuthStore } from '@/stores/auth';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const auth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  if (!!to.meta.requiresAuth && !authStore.loggedIn) {
    return next({ name: 'Login', query: { redirect: to.path } });
  }
  return next();
};
