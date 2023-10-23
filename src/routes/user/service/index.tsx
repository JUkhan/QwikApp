import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import prisma from "~/lib/prismaClient";

export const useGetUser = routeLoader$(async () => {
  return await prisma.service.findMany()
});

export default component$(() => {
  const services = useGetUser();
  return (

    <section class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Available Services</h2>
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
              </tr>)}

            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
});
