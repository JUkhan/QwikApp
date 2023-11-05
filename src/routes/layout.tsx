import { component$, Slot, useContext, useStyles$, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Menu from "~/components/menu/menu";
import styles from "./styles.css?inline";
import {  AppContext, getUser } from "~/lib/users";
import Toast from "~/components/Toast/Toast";
import ImgGift from '~/media/gift.jpg?jsx';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
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
  const user = useGetUser();
  const state = useContext(AppContext);
  useTask$(({track})=>{
      track(()=>user.value)
      state.user = user.value as any;
  });
 
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
              <ImgGift class="w-12 h-12 mask mask-pentagon" />
            </div>
            <div class="flex-none hidden lg:block">
              <ul class="menu menu-horizontal">
                <Menu/>
              </ul>
            </div>
          </div>
          <div class="flex justify-center">
            <Toast/>
            <Slot/>
          </div>
        </div>
        <div class="drawer-side">
          <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-200">
            <Menu/>
          </ul>
        </div>
      </div>
    </>
  );
});
