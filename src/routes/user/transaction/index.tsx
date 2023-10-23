//@ts-nocheck
import { component$, useContext } from "@builder.io/qwik";
import { routeAction$, zod$, z, Form, routeLoader$, } from "@builder.io/qwik-city";
import prisma from "~/lib/prismaClient";
import { AppContext, getAvailableAmount, getUniqueCode, getUser, Status } from "~/lib/users";


export const useCreateUser = routeAction$(
    async (data, requestEvent) => {
        try {
            const user = await getUser(requestEvent);
            const code = await getUniqueCode();
            const chargeList = await prisma.charge.findMany();
            const transaction = await prisma.transaction.create({
                data: { ...data, serviceId: +data.serviceId, code, status: Status.submitted, createdAt: new Date(), updatedAt: new Date(), amount: +data.amount, userId: user.id, availableAmount: getAvailableAmount(chargeList, +data.amount) }
            });
            return {
                type: 'success',
                msg: 'Transaction has been submitted successfully',
                transaction
            };
        } catch (ex: any) {
            return {
                type: 'error',
                msg: ex.message
            };
        }
    },
    zod$({
        recipientName: z.string().min(5, 'User name must contain at least 5 character(s)'),
        recipientPhone: z.string().regex(/(\d\d\d) (\d\d\d) (\d\d\d\d)/, 'This is not a valid phone number ex: 111 222 3333'),
        recipientCity: z.string(),
        recipientEmail: z.string().email().optional(),
        amount: z.string().min(1, 'Amount should be minimum one CAD'),
        paymentMethod: z.string(),
        serviceId: z.string().min(1, 'Please select a service'),
        referenceNo: z.string(),
        statement: z.string().min(30, 'Statement must contain at least 30 character(s)')
    }),
);

export const useServices = routeLoader$(async () => {
    const services = await prisma.service.findMany();
    return services;
});

export default component$(() => {
    const createUserAction = useCreateUser();
    const state = useContext(AppContext)
    const services = useServices();
    if (createUserAction.value?.type) {
        state.toast = createUserAction.value as any;
        if (createUserAction.value.type === 'success') {
            return <>
                <h3 class="alert alert-success font-bold p-4 rounded-sm">8 Digit Alpha-Numeric code  ({createUserAction.value.transaction.code}) </h3>
                <p class="p-4 mt-4 font-extrabold border-2 transaction-width">
                    {createUserAction.value.transaction?.statement}
                </p>
            </>
        }
    }
    return (
        <>
            <Form action={createUserAction} noValidate>
                <div class="card transaction-width bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">Make A Gift</h2>

                        <label>
                            Recipient Name
                        </label>
                        <input type="text" name="recipientName" value={createUserAction.formData?.get("recipientName")} placeholder="recipientName Name" class="input input-bordered input-sm input-primary w-full" />
                        {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.recipientName}</p>}
                        <label>
                            Recipient Phone
                        </label>
                        <input type="text" name="recipientPhone" value={createUserAction.formData?.get("recipientPhone")} placeholder="Recipient Phone" class="input input-bordered input-sm input-primary w-full" />
                        {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.recipientPhone}</p>}

                        <label>Recipient Town / City / Village</label>
                        <input type="text" name="recipientCity" value={createUserAction.formData?.get("recipientCity")} placeholder="Recipient Town / City / Village" class="input input-bordered input-sm input-primary w-full" />
                        {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.recipientCity}</p>}
                        
                        <label>Recipient Email</label>
                        <input type="text" name="recipientEmail" value={createUserAction.formData?.get("recipientEmail")} placeholder="Recipient Email" class="input input-bordered input-sm input-primary w-full" />
                        {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.recipientEmail}</p>}
                       
                        <label>
                            Amount (CAD)
                        </label>
                        <input type="number" name="amount" value={createUserAction.formData?.get("amount")} placeholder="amount" class="input input-bordered input-sm input-primary w-full" />
                        {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.amount}</p>}
                        <label>
                            Payment Method
                        </label>
                        <input type="text" name="paymentMethod" value={createUserAction.formData?.get("paymentMethod")} placeholder="Payment Method" class="input input-bordered input-sm input-primary w-full" />
                        {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.paymentMethod}</p>}

                        <label>
                            Service
                        </label>
                        <select name="serviceId" value={createUserAction.formData?.get("serviceId")} class="select select-primary select-sm w-full">
                            <option value="">Select a service</option>
                            {services.value.map(srv => <option key={srv.id} value={srv.id}>{srv.name}</option>)}
                        </select>

                        {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.serviceId}</p>}
                        <label>
                            Reference No
                        </label>
                        <input type="text" name="referenceNo" value={createUserAction.formData?.get("referenceNo")} placeholder="referenceNo" class="input input-bordered input-sm input-primary w-full" />
                        {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.referenceNo}</p>}
                        <label>
                            Statement
                        </label>
                        <textarea rows={5} name="statement" value={createUserAction.formData?.get("statement")} class="textarea textarea-primary  w-full" placeholder="statement"></textarea>

                        {createUserAction.value?.failed && <p class="text-red-700 text-xs">{createUserAction.value.fieldErrors.statement}</p>}

                        <div class="card-actions justify-end">
                            <button type="submit" class="btn btn-sm btn-primary">Submit</button>
                        </div>
                    </div>
                </div>

            </Form>
        </>
    );
});
