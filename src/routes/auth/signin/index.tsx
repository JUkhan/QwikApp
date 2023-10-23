
import { component$, useStore } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useAuthSignin } from "~/routes/plugin@auth";

export default component$(() => {
    const signIn = useAuthSignin();
    const authCred = useStore({
        username: '',
        password: ''
      });
   
    return (
        <>
            <Form>
                <div class="card w-96 bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">Signin</h2>
                        
                        <label>User Name</label>
                        <input type="text" name="username"
                        onInput$ = {
                            (e) => {
                              authCred.username = (e.target as HTMLInputElement).value
                            }
                          }
                        placeholder="User Name" class="input input-bordered input-sm input-primary w-full max-w-xs" />

                        <label>Password</label>
                        <input type="password"
                        onInput$ = {
                            (e) => {
                              authCred.password = (e.target as HTMLInputElement).value
                            }
                          }
                        name="password" placeholder="Password" class="input input-bordered input-sm input-primary w-full max-w-xs" />

                        <div class="card-actions justify-end">
                            <button type="submit"
                            preventdefault:click 
                            onClick$ = {()=>
                              {
                                signIn.submit({
                                  providerId: 'credentials', // Needs to be the credential provider not the credential name
                                  options: {
                                    username: authCred.username,
                                    password: authCred.password,
                                    callbackUrl: '/' // Redirect on Success
                                  }
                                });
                            }
                            } 
                            class="btn btn-sm btn-primary">Signin</button>
                        </div>
                    </div>
                </div>

            </Form>
        </>
    );
});
