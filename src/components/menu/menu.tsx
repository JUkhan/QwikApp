import { component$ } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";
import { UserRules } from "~/lib/users";

import { useAuthSignout } from "~/routes/plugin@auth";


export default component$<{ rules?: string }>(({ rules }) => {
    const logoutAction = useAuthSignout();
    //const loggedIn = useAuthSession();
    const user = rules === UserRules.user ? <li>
        <details>
            <summary>User</summary>
            <ul class="w-40 z-50">
                <li>
                    <Link href="/user/service">Services</Link>
                </li>
                <li>
                    <Link href="/user/status">Gift Status</Link>
                </li>
                <li>
                    <Link href="/user/transaction">Make A Gift</Link>
                </li>
            </ul>
        </details>
    </li> : null;
    const admin = rules === UserRules.admin ? <li>
        <details>
            <summary>Admin</summary>
            <ul class="w-40 z-50">
                <li>
                    under construction...
                </li>
                
            </ul>

        </details>
    </li> : null;
    return (
        <>
            {user}
            {admin}
            {rules ? <li>
                <Form>
                    <button
                        preventdefault: click
                        onClick$={() => {
                            logoutAction.submit({
                                callbackUrl: '/'
                            });
                        }
                        }
                    >SignOut</button>
                </Form>
            </li> :
                <>
                    <li><Link href="/signup">SignUp</Link></li>
                    <li><Link href="/auth/signin">SignIn</Link></li>
                </>
            }

        </>
    );
});
