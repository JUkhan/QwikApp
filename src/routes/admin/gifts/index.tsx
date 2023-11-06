// @ts-nocheck
import { component$, $, useContext } from "@builder.io/qwik";
import { routeLoader$,server$ } from "@builder.io/qwik-city";
import prisma from "~/lib/prismaClient";
import { AppContext, Status, UpdatedMessage, getUser } from "~/lib/users";
import AgGrid from '~/components/grid/grid';
import editForm from './edit';

export const useGetData = routeLoader$(async (request) => {
  const user = await getUser(request);
  const gifts = await prisma.transaction.findMany({ where: { userId: user?.id } });
  return gifts;
});
const colDefs = [
  { field: 'recipientName' },
  { field: 'recipientPhone' },
  { field: 'recipientEmail' },
  { field: 'recipientCity' },
  { field: 'amount' },
  { field: 'availableAmount' },
  { field: 'status' },
  { field: 'code' },
];
const updateStatus = server$(async (id: number, status:string) => {
    const trans = await prisma.transaction.update({where:{id}, data:{status}});
    return trans;
});
export default component$(() => {
  const gifts = useGetData();
  const state = useContext(AppContext);
  const action = $(async(actionName: string, data: any) => {
    const status =actionName==='verify'?Status.verified:actionName==='paid'?Status.paid:'';
    const updated = await updateStatus(data.id, status);
    state.formData = updated;
    state.toast={type:'success', msg:UpdatedMessage};
  })
  const edit = $((data: any) => {
    state.formData = data;
    state.DynamicCom = editForm;
    state.show();
  });
  return (
    <AgGrid
      rowData={gifts.value}
      columnDefs={colDefs}
      title="Gifts"
      editCallback={edit}
      hideAddButton={true}
      actionNames="edit,verify,paid"
      actionCallback={action}
    />
  );
});
