import router from './index';
import useUserStore from '../store/user';

router.beforeEach((to, from) => {
  const userStore = useUserStore();
  const hasToken = !!userStore.token;

  if (!hasToken || to.path === '/login') {
    userStore.resetUserStore();

    return to.path === '/login' ? true : '/login';
  }

  return to.path !== from.path;
});

router.afterEach(() => {});
