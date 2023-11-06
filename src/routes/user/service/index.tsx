import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import prisma from "~/lib/prismaClient";
import AgGrid from '~/components/grid/grid';

export const useGeData = routeLoader$(async () => {
  return await prisma.service.findMany()
});
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
  const services = useGeData();
  return (
    <AgGrid 
    rowData={services.value} 
    columnDefs={colDefs} 
    title="Available Services" 
    showActions={false}
    hideAddButton={true}
  />  
  );
});
