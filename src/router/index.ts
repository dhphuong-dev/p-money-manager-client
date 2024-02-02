import { createRouter, createWebHistory } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from 'virtual:generated-pages';
import { auth } from '@/middlewares';

const routes = setupLayouts(generatedRoutes);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(auth);

router.afterEach((to) => {
  const defaultDocumentTitle = 'pMoney Manager';
  if (to.name) {
    document.title = `${String(to.name)} - ${defaultDocumentTitle}`;
  } else {
    document.title = defaultDocumentTitle;
  }
});

export default router;
