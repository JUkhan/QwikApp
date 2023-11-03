import { component$, $, useContext, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import prisma from "~/lib/prismaClient";
import { AppContext, DeletedMessage } from "~/lib/users";
import serviceForm from "~/components/crud/serviceForm";
import Confirm from '~/components/confirm';

export const useGetUser = routeLoader$(async () => {
  return await prisma.service.findMany()
});

const remove = server$(async (data:any)=>{
    const res = await prisma.service.delete({where:{id:data.id}});
    return res;
})

export default component$(() => {
  const services = useGetUser();
  const state = useContext(AppContext);
  const add = $(() => {
    state.formData = { id: 0, name: '', type: '', description: '', contact: '', city: '', address: '', mediaLink: '' };
    state.DynamicCom = serviceForm;
    state.show();
  });
  const edit = $((data: any) => {
    state.formData = data;
    state.DynamicCom = serviceForm;
    state.show();
  });

  useVisibleTask$(({ track }) => {
    track(() => state.formData);
    if (state.formData.id) {
      const arr = services.value.slice();
      const index = services.value.findIndex(it => it.id == state.formData.id);
      if (index >= 0) {
        arr[index] = state.formData;
      } else {
        arr.unshift(state.formData);
      }
      //@ts-ignore
      services.value = arr;
    }
  });
  const isOpened = useSignal<boolean>(false);
  const yes = $(async (val: boolean) => {
    if(val){
      const res = await remove(state.formData);
      state.toast={type:'success', msg:DeletedMessage}
      //@ts-ignore
      services.value = services.value.filter(el=>el.id!==res.id);
    }
    isOpened.value=false;
  });
  return (
    <>
      <Confirm opened={isOpened.value} confirmCallback={yes} />
      <section class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex justify-between">
            <h2 class="card-title">Available Services</h2>
            <div class="tooltip" data-tip="Add">
              <button onClick$={add} class="btn btn-sm btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service Type</th>
                  <th>Description</th>
                  <th>Contact</th>
                  <th>City</th>
                  <th>Address</th>
                  <th>Media Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.value.map(s => <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.type}</td>
                  <td>{s.description}</td>
                  <td>{s.contact}</td>
                  <td>{s.city}</td>
                  <td>{s.address}</td>
                  <td>{s.mediaLink}</td>
                  <td>
                    <span class="tooltip" data-tip="Edit">
                      <button onClick$={() => edit(s)} class="btn btn-sm btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                      </button></span>
                    <span class="tooltip" data-tip="Delete">
                      <button onClick$={()=>{state.formData=s;isOpened.value=true;}} class="btn btn-sm btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                      </button></span>
                  </td>
                </tr>)}

              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
});
