
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function getClassName(str){
    return str.replace(/\s+/g,'_')
}
export const Actions = class TotalValueRenderer {
    getActionButtons(actions, params) {
        return actions.reduce((res, action) => {
            switch (action) {
                case 'edit':
                    res.push(`<button title="Edit" class="${action}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="24"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                  </button>`);
                    break;
                case 'remove':
                    res.push(`<button title="Remove" class="${action}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                  </button>`);
                    break;
                default:
                    const callback = `${action}_condition`;

                    if(!params[callback]){
                        params[callback]=()=>true;
                    }
                    if (params[callback](params.data)) {
                        res.push(`<button name="${action}" title="${action}" class="commonBtn ${getClassName(action)}">
                    ${capitalizeFirstLetter(action)}
                  </button>`);
                    }
                    break;
            }
            return res;
        }, [])
    }
    
    setActionListener(actions, params){
        this.listeners=actions.reduce((res, action) => {
            const elm =  this.eGui.querySelector(`.${getClassName(action)}`);
            if(elm){
                let listener;
                if(action==='edit'){
                    listener =() => params.edit(params.data)
                }
                else if(action==='remove'){
                    listener =() => params.remove(params.data)
                }
                else{
                    listener =(e) => params.commonAction(e.target.name, params.data)
                }
                elm.addEventListener('click', listener);
                res.push({elm, listener});
            }
            return res;
        },[]);
    }
    // gets called once before the renderer is used
    init(params) {
        // create the cell
        this.eGui = document.createElement('div');
        
        const actions = params.actionNames.split(',');

        this.eGui.innerHTML = `<div>${this.getActionButtons(actions, params).join('')}</div>`;

        this.setActionListener(actions, params);
        
    }

    getGui() {
        return this.eGui;
    }

    // gets called whenever the cell refreshes
    refresh() {

        // return true to tell the grid we refreshed successfully
        return false;
    }

    // gets called when the cell is removed from the grid
    destroy() {
        for(let obj of this.listeners){
            if(obj.elm){
                obj.elm.removeEventListener('click', obj.listener);
            }
        }
    }

    getValueToDisplay(params) {
        return params.valueFormatted ? params.valueFormatted : params.value;
    }
}

