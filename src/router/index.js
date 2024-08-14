
import Pace from "pace-js"
import PageHome from '@/pages/PageHome.vue'
import { useApplicationStore } from '@/stores/application'
import { createRouter, createWebHistory } from 'vue-router'

const isLoadComplete = async () => {
  const applicationStore = useApplicationStore();
  Pace.on("done", async () => {
    applicationStore.setIsLoadinfgStatus(false);
    if (applicationStore.isDeviceMobile) {
      document.getElementById("application").style.paddingTop = "65px";
    } else document.getElementById("application").style.paddingTop = "75px";
  });
}

const createRoutes = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
      path: '/',
      name: 'home',
      component: PageHome,
      beforeEnter: [isLoadComplete],
  }],
  scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;
		if (to.meta.scrollToTop) return { top: 0 };
		if (to.hash) return { el: to.hash, behavior: "smooth" };
	}
});

createRoutes.beforeEach(async (to, from, next) => {
	if (to === from) return;
	const applicationStore = useApplicationStore();
	Pace.on("start", async () => {
    await applicationStore.setIsLoadinfgStatus(true);
    document.getElementById("application").style.paddingTop = "0px";
  });
	next();
});

export default createRoutes
