import { component$, Slot, useContextProvider, useStore, useStyles$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Menu from "~/components/menu/menu";


import styles from "./styles.css?inline";
import type { AppState } from "~/lib/users";
import { AppContext, getUser } from "~/lib/users";
import Toast from "~/components/Toast/Toast";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export const useGetUser = routeLoader$(async (request) => {
  return getUser(request);
});

export default component$(() => {

  useContextProvider(AppContext, useStore<AppState>({
    toast: { type: 'info' }
  }, { deep: false }));
  const user = useGetUser();
  useStyles$(styles);
  return (
    <>
      
      <div class="drawer">
        <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
          <div class="w-full navbar bg-base-300">
            <div class="flex-none lg:hidden">
              <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </label>
            </div>
            <div class="flex-1 px-2 mx-2">
              <img width={50} height={50} class="mask mask-diamond" src="/gift.jpg" alt="cool" />

            </div>
            <div class="flex-none hidden lg:block">
              <ul class="menu menu-horizontal">
                <Menu rules={user.value?.rules} />
              </ul>
            </div>
          </div>
          <div class="flex justify-center p-10">
            <Toast />
            <Slot />
          </div>
        </div>
        <div class="drawer-side">
          <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-200">
            <Menu rules={user.value?.rules} />
          </ul>
        </div>
      </div>
    </>
  );
});
