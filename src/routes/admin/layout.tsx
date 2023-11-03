import { Slot, component$, useContext } from "@builder.io/qwik";
import { useAuthSession } from "../plugin@auth";
import { AppContext, UserRules } from "~/lib/users";

export default component$(() => {
    const loggedIn = useAuthSession();
    const state = useContext(AppContext);
    if (!loggedIn.value || state.user?.rules!==UserRules.admin) {
        return (<div class="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>'You are not authorized for this page.'</span>
        </div>)
    }
    return (<div class="drawer drawer-end">
        <input id="my-drawer" onChange$={(e)=>{state.sideBarOpened=e.target.checked}} checked={state.sideBarOpened} type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex justify-center">
            <Slot />
        </div>
        <div class="drawer-side" style={{marginTop:'4.5rem'}}>
            <label aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="w-1/3 min-h-full bg-base-200 text-base-content">
               <state.DynamicCom/>
            </div>
        </div>
    </div>);
});
