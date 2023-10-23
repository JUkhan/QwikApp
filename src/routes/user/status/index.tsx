// @ts-nocheck
import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import prisma from "~/lib/prismaClient";
import { getUser } from "~/lib/users";
import { useAuthSession } from "~/routes/plugin@auth";

export const useGetUser = routeLoader$(async (request) => {
    const user = await getUser(request);
    const gifts = await prisma.transaction.findMany({where:{userId:user?.id}});
    return gifts;
});

export default component$(() => {
  const gifts = useGetUser();
  const loggedIn = useAuthSession();
  return (

    <section class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">All the gifts belongs to user '{loggedIn.value?.user?.name}'</h2>
        <div class="overflow-x-auto">
          <table class="table">
          <thead>
              <tr>
                <th>Recipient Name</th>
                <th>Recipient Phone</th>
                <th>Recipient Email</th>
                <th>Recipient City</th>
                <th>Available Amount</th>
                <th>Vendor Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
                {gifts.value.map(s=><tr key={s.id}>
                    <td>{s.recipientName}</td>
                    <td>{s.recipientPhone}</td>
                    <td>{s.recipientEmail}</td>
                    <td>{s.recipientCity}</td>
                    <td>{s.availableAmount}</td>
                    <td>{s.amount}</td>
                    <td>{s.status}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
});
