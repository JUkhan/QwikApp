import { component$, useContext } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import crud from "~/components/crud/crud";

import prisma from "~/lib/prismaClient";
import { AppContext } from "~/lib/users";

export const useGetUsers = routeLoader$(async () => {
  const users = await prisma.user.findMany();
  return users;
});

export default component$(() => {
    const state = useContext(AppContext);
  return (
    <section>
      <h1>User's directory</h1>
      <button class="btn btn-primary" 
      onClick$={()=>{
        state.DynamicCom = crud
        state.formData={email:'jasim@gmail.com', password:'password'}
        state.show();
        }}>
        Open Sidebar
        </button>
    </section>
  );
});

