import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import { AppContext } from "~/lib/users";


export default component$(() => {
  const state = useContext(AppContext);
  const type = `alert alert-${state.toast.type}`
  useVisibleTask$(({ cleanup, track }) => {
    track(() => state.toast.type);
    if (state.toast.msg) {
      const interval = setInterval(() => {
        state.toast.msg=''
      }, 3000);
      cleanup(() => clearInterval(interval));
    }
  })
  return (
    <>
      {state.toast.msg && <div class="toast toast-top toast-center z-50">
        <div class={type}>
          {state.toast.type==='info' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          {state.toast.type==='success' && <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          {state.toast.type==='error' && <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          <span>{state.toast.msg}</span>
        </div>
      </div>}
    </>
  );
});
