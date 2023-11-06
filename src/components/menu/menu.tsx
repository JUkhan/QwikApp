// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import { component$, useContext, $ } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";
import { AppContext, UserRules } from "~/lib/users";

import { useAuthSignout } from "~/routes/plugin@auth";


export default component$(() => {
    const logoutAction = useAuthSignout();
    const state = useContext(AppContext)
    const setActiveMenu = $((val)=>{
        state.activeMenu=val;
    });
    const user = state.user?.rules ? <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-sm">
            User
        </label>
        <ul tabindex="0" class="menuButton">
            <li onClick$={()=>setActiveMenu('u1')}>
                <Link class={{active:state.activeMenu==='u1'}} href="/user/service">Services</Link>
            </li>
            <li onClick$={()=>setActiveMenu('u2')}>
                <Link class={{active:state.activeMenu==='u2'}} href="/user/status">Gift Status</Link>
            </li>
            <li onClick$={()=>setActiveMenu('u3')}>
                <Link class={{active:state.activeMenu==='u3'}} href="/user/transaction">Make A Gift</Link>
            </li>
        </ul>
    </div> : null;
    const admin = state.user?.rules === UserRules.admin ? <div class="dropdown dropdown-end">
        <label tabindex="1" class="btn btn-ghost btn-sm">
            Admin
        </label>
        <ul tabindex="1" class="menuButton">
            <li onClick$={()=>setActiveMenu('a1')}>
                <Link class={{active:state.activeMenu==='a1'}} href="/admin/service">Services</Link>
            </li>
            <li onClick$={()=>setActiveMenu('a2')}>
                <Link class={{active:state.activeMenu==='a2'}} href="/admin/charge">Charge</Link>
            </li>
            <li onClick$={()=>setActiveMenu('a3')}>
                <Link class={{active:state.activeMenu==='a3'}} href="/admin/user">User</Link>
            </li>
            <li onClick$={()=>setActiveMenu('a4')}>
                <Link class={{active:state.activeMenu==='a4'}} href="/admin/gifts">Gifts</Link>
            </li>

        </ul>
    </div> : null;
    const setTheme = $((theme)=>{
        state.theme=theme;
    });

    return (
        <>
            {admin}
            {user}
            <div class="dropdown dropdown-end">
                <label tabindex="2" class="btn btn-ghost btn-sm">
                    Themes
                </label>
                <ul tabindex="3" class="menuButton">
                    <li  onClick$={()=>setTheme('light')}>
                       <Link class={{'active':state.theme==='light'}}>Light</Link>
                    </li>
                    <li onClick$={()=>setTheme('valentine')}>
                     <Link class={{'active':state.theme==='valentine'}}>Valentine</Link>
                    </li>

                </ul>
            </div>
            {state.user ? 
                <Form>
                    <button class="btn btn-ghost btn-sm"
                        preventdefault: click
                        onClick$={() => {
                            logoutAction.submit({
                                callbackUrl: '/'
                            }).then(() => {
                                state.user = undefined;
                            });
                        }
                        }
                    >SignOut</button>
                </Form>
             :
                <>
                    <button class="btn btn-ghost btn-sm"><Link href="/signup">SignUp</Link></button>
                    <button class="btn btn-ghost btn-sm"><Link href="/auth/signin">SignIn</Link></button>
                </>
            }

        </>
    );
});
