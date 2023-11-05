import { component$, $, useContext} from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import prisma from "~/lib/prismaClient";
import { AppContext, DeletedMessage } from "~/lib/users";
import serviceForm from "~/components/crud/serviceForm";
import AgGrid from '~/components/grid/grid';

export const useGetServices = routeLoader$(async () => {
  return await prisma.service.findMany()
});

const remove = server$(async (data:any)=>{
    const res = await prisma.service.delete({where:{id:data.id}});
    return res;
})

const colDefs=[
  {field:'name'},
  {field:'type'},
  {field:'description'},
  {field:'contact'},
  {field:'city'},
  {field:'address'},
  {field:'mediaLink'}
];
export default component$(() => {
  const services = useGetServices();
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

  const removeCallback = $(async () => {
      const res = await remove(state.formData);
      state.formData=res;
      state.toast={type:'success', msg:DeletedMessage}
  });
  
  return (
      <AgGrid 
        rowData={services.value} 
        columnDefs={colDefs} 
        title="Services" 
        addCallback={add}
        editCallback={edit} 
        removeCallback={removeCallback}
      />  
  );
});
