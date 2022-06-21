import { createApp }               /**/ from 'vue';
import App                              from './App.vue';
import router                           from './router';
import idbReady                         from 'safari-14-idb-fix';
import FontFaceObserver                 from 'fontfaceobserver';
import VueTippy                         from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/translucent.css';
//
import './index.css';

(async function () {
  await new FontFaceObserver('Always Together').load();
  await idbReady();

  const app = createApp(App);
  app.use(router)
  app.use(VueTippy, {
    defaultProps: { theme: 'translucent' },
  });
  app.mount('#app');
})();
