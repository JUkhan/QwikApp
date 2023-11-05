import { component$, $, useSignal, useVisibleTask$, useContext, type PropFunction, noSerialize } from "@builder.io/qwik";
import { Grid } from "ag-grid-community";
import { AddedMessage, AppContext, DeletedMessage, UpdatedMessage } from "~/lib/users";
import Toolbar from "./Toolbar";
import { Actions } from "./actions"
import Confirm from "./confirm";
//const obj: { api?: GridApi } = { api: null as any };
export default component$<GridProps>(({
    rowData, columnDefs, getRowId, pageSize = 20,
    height = '520px', editCallback, removeCallback, showActions = true,
    title, addCallback, hideAddButton }) => {
    const elmRef = useSignal<HTMLElement>();
    const gridCreated = useSignal<boolean>(false);
    const state = useContext(AppContext)
    const opened = useSignal<boolean>(false);
    const api = useSignal<any>();
    useVisibleTask$(({ track }) => {
        track(() => state.toast)
        if (api.value && state.toast.msg) {
            switch (state.toast.msg) {
                case AddedMessage:
                    api.value.applyTransaction({ add: [state.formData], addIndex: 0 });
                    break
                case UpdatedMessage:
                    api.value.applyTransaction({ update: [state.formData] });
                    break
                case DeletedMessage:
                    api.value.applyTransaction({ remove: [state.formData] });
                    break

            }

        }
    });
    useVisibleTask$(() => {
        if (elmRef.value) {
            if (!gridCreated.value) {
                gridCreated.value = true;
                if (showActions) {
                    columnDefs.push({
                        sortable: false,
                        filter: false,
                        headerName: 'Actions',
                        cellRenderer: Actions,
                        cellRendererParams: {
                            edit: (data: any) => {
                                if (editCallback) {
                                    editCallback(data);
                                }
                            },
                            remove: (data: any) => {
                                state.formData = data;
                                opened.value = true;
                            }
                        }
                    })
                }

                new Grid(elmRef.value, {
                    rowData: rowData,
                    columnDefs: columnDefs,

                    defaultColDef: {
                        sortable: true,
                        filter: true,
                        resizable: true,
                        flex: 1
                    },
                    onGridReady: (event) => {
                        //obj.api = event.api;
                        api.value = noSerialize(event.api);
                    },
                    animateRows: true,
                    pagination: true,
                    //rowModelType: 'infinite',
                    cacheBlockSize: pageSize,
                    paginationPageSize: pageSize,
                    getRowId: getRowId ? getRowId : (params: any) => params.data.id
                });
            }
        }

    })
    const confirmCallBack = $((val: boolean) => {
        if (val && removeCallback) {
            removeCallback();
        }
        opened.value = false;
    })
    return (<>
        <Toolbar title={title} hideAddButton={hideAddButton} addCallback={addCallback} />
        <div class="ag-theme-alpine" ref={elmRef} style={{ width: '100%', height }}></div>
        <Confirm opened={opened.value} confirmCallback={confirmCallBack} />
    </>)
});

export interface GridProps {
    columnDefs: any[],
    rowData: any[],
    getRowId?: PropFunction<(params: any) => any>,
    pageSize?: number,
    title: string,
    addCallback?: PropFunction<() => void>,
    editCallback?: PropFunction<(data: any) => void>,
    removeCallback?: PropFunction<() => void>,
    hideAddButton?: boolean,
    height?: string,
    showActions?: boolean
}