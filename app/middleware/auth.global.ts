export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  // 로그인 페이지로 가는데 이미 로그인되어 있으면 홈으로
  if (to.path === '/login') {
    if (loggedIn.value) return navigateTo('/');
    return;
  }

  // 로그인 안 된 상태면 무조건 로그인 페이지로
  if (!loggedIn.value) {
    return navigateTo('/login', { replace: true });
  }
});
