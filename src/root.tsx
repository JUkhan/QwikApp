import { component$, useContextProvider, useStore, $ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import type { AppState } from "~/lib/users";
import { AppContext } from "~/lib/users";

import "./global.css";
import Empty from "./components/empty/empty";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  const state = useStore<AppState>({
    toast: { type: 'info' },
    theme:'light',
    sideBarOpened:false,
    DynamicCom:Empty,
    show: $(function (this: AppState) {
      this.sideBarOpened=true;
    }),
    hide: $(function (this: AppState) {
      this.sideBarOpened=false;
      this.DynamicCom= Empty;
    }),
    formData:{},
    activeMenu:''
  }, { deep: false });

  useContextProvider(AppContext, state);
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="en" data-theme={state.theme}>
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
