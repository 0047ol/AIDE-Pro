/* eslint-disable no-undef */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import config from '@/scripts/config'
import axiostool from '@/scripts/axiostool'

const isMobile = () => {
  if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) || window.innerWidth <= 1000) {
    document.getElementById("application").style.paddingTop = "65px";
    return true;
  } else {
    document.getElementById("application").style.paddingTop = "75px";
    return false;
  }
}

onresize = async () => {
  let state = isMobile();
  const applicationStore = useApplicationStore();
  applicationStore.setIsDeviceMobile(state);
}

export const useApplicationStore = defineStore('application', () => {
  const isLoadingStatus = ref(true);
  const isSiteErrStatus = ref(false);
  const siteErrorDetail = ref(null);
  const isDeviceMobile = ref(isMobile());

  const setSiteConfig = async () => {
    try {
      const response = await axiostool.sendHttpGet(config.server);

      if (typeof(response.data) === 'string') {
        isSiteErrStatus.value = true;
        isLoadingStatus.value = false;
        siteErrorDetail.value = response.data;
        ElMessage({ message: '配置文件解析失败', type: 'error', plain: true});
      } else if (response.data.code !== 200) {
        isSiteErrStatus.value = true;
        siteErrorDetail.value = error;
        ElMessage({ message: '获取配置文件失败', type: 'error', plain: true});
      }

    } catch(error) {
      isSiteErrStatus.value = true;
      siteErrorDetail.value = error;
      ElMessage({ message: '获取配置文件失败', type: 'error', plain: true});
    }
  };

  const setIsDeviceMobile = (value) => isDeviceMobile.value = value;
  const setIsLoadinfgStatus = (value) => isLoadingStatus.value = value;

  return { isDeviceMobile, isSiteErrStatus, isLoadingStatus, siteErrorDetail, setIsDeviceMobile, setIsLoadinfgStatus, setSiteConfig }
});
