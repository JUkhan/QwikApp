import { component$, $, useContext} from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import prisma from "~/lib/prismaClient";
import { AppContext, DeletedMessage } from "~/lib/users";
import serviceForm from "~/components/crud/userForm";
import AgGrid from '~/components/grid/grid';

export const useList = routeLoader$(async () => {
  return await prisma.user.findMany()
});

const remove = server$(async (data:any)=>{
    const res = await prisma.user.delete({where:{id:data.id}});
    return res;
})

const colDefs=[
  {field:'name'},
  {field:'email'},
  {field:'rules', headerName:'Rule'}
];
export default component$(() => {
  const services = useList();
  const state = useContext(AppContext);
  const add = $(() => {
    state.formData = { id: 0, amount: '', cost:'' };
    state.DynamicCom = serviceForm;
    state.show();
  });
  const edit = $((data: any) => {
    console.log(services.value);
    state.formData = data;
    state.DynamicCom = serviceForm;
    state.show();
  });

  const removeCallback = $(async () => {
      const res = await remove(state.formData);
      state.formData=res;
      state.toast={type:'success', msg:DeletedMessage}
  });
  
  return (
      <AgGrid 
        rowData={services.value} 
        columnDefs={colDefs} 
        title="Users" 
        hideAddButton={true}
        addCallback={add}
        editCallback={edit} 
        removeCallback={removeCallback}
      />  
  );
});
