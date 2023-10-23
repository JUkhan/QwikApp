
import { component$, useContext } from "@builder.io/qwik";
import { routeAction$, zod$, z, Form, useNavigate, } from "@builder.io/qwik-city";
import prisma from "~/lib/prismaClient";
import { AppContext } from "~/lib/users";

export const useCreateUser = routeAction$(
  async (data) => {
    
    const find = await prisma.user.findFirst({
      where: {
        OR: [
          { name: data.name },
          { email: data.email }
        ]
      }
    });
    if(find && find.name===data.name){
      return {
        type:'error',
        msg:'User name is already exist'
      }
    }
    if(find && find.email===data.email){
      return {
        type:'error',
        msg:'Email id is already used'
      }
    }
    
    await prisma.user.create({
      data:{...data, rules:'user'} as any
    });
    return {
      type: 'success',
      msg: 'Your signup has been successful. Please login to continue'
    };
  },
  zod$({
    name: z.string().min(5, 'User name must contain at least 5 character(s)'),
    phone: z.string().regex(/(\d\d\d) (\d\d\d) (\d\d\d\d)/,'This is not a valid phone number ex: 111 222 3333'),
    password: z.string().min(3, 'Password must contain at least 3 character(s)'),
    email: z.string().email().optional()
  }),
);

export default component$(() => {
  const createUserAction = useCreateUser();
  const navigate = useNavigate();
 const state = useContext(AppContext)
  if(createUserAction.value?.type){
    state.toast=createUserAction.value as any;
    if(createUserAction.value.type==='success'){
      navigate('/');
    }
  }
  return (
    <>
    <Form action={createUserAction}>
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Signup!</h2>

          <label>
            Name
          </label>
          <input type="text" name="name" value={createUserAction.formData?.get("name")} placeholder="User Name" class="input input-bordered input-sm input-primary w-full max-w-xs" />
          {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.name}</p>}
          <label>
            Phone
          </label>
          <input type="text" name="phone" value={createUserAction.formData?.get("phone")} placeholder="Phone" class="input input-bordered input-sm input-primary w-full max-w-xs" />
          {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.phone}</p>}

          <label>
            Email
          </label>
          <input type="text" name="email" value={createUserAction.formData?.get("email")} placeholder="Email" class="input input-bordered input-sm input-primary w-full max-w-xs" />
          {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.email}</p>}
          <label>
            Password
          </label>
          <input type="password" name="password" value={createUserAction.formData?.get("password")} placeholder="Password" class="input input-bordered input-sm input-primary w-full max-w-xs" />
          {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.password}</p>}

          <div class="card-actions justify-end">
            <button type="submit" class="btn btn-sm btn-primary">Signup</button>
          </div>
        </div>
      </div>

    </Form>
    </>
  );
});
