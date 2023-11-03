import { type PropFunction, component$ } from "@builder.io/qwik";
import { ConfirmedMessage, ConfirmedTitle } from "~/lib/users";


export default component$<ConfirmParams>(({ title, message, opened, confirmCallback }) => {

    return (
        <>
            <input type="checkbox" checked={opened} id="my_modal_6" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">{title ? title : ConfirmedTitle}</h3>
                    <p class="py-4">{message ? message : ConfirmedMessage}</p>
                    <div class="modal-action">
                        <label onClick$={()=>confirmCallback(false)} for="my_modal_6" class="btn">No</label>
                        <label onClick$={()=>confirmCallback(true)} class="btn btn-active btn-error">Yes</label>
                    </div>
                </div>
            </div>
        </>
    );
});

export interface ConfirmParams {
    title?: string,
    message?: string,
    opened: boolean,
    confirmCallback: PropFunction<(val: boolean) => void>
}