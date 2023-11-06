import { type PropFunction, component$ } from "@builder.io/qwik";


export default component$<ConfirmParams>(({ title, addCallback, hideAddButton=false }) => {

    return (
        <div class="p-2 bg-base-200 shadow-xl">
        <div class="flex flex-row justify-between h-8">
            <h2 class="card-title">{title}</h2>
            {!hideAddButton?<div class="tooltip" data-tip="Add">
               <button onClick$={addCallback} class="btn btn-sm btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
                </button>
            </div>:null}
        </div>
        </div>
    );
});

export interface ConfirmParams {
    title: string,
    addCallback?: PropFunction<() => void>,
    hideAddButton?:boolean
}