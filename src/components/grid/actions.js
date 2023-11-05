

export const Actions= class TotalValueRenderer {
    // gets called once before the renderer is used
    init(params) {
        // create the cell
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = `<div>
        <button title="Edit" class="edit">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="24"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
        </button>
        <button title="Remove" class="remove">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
        </button>
        </div>
       `;

        // get references to the elements we want
        this.btnEdit = this.eGui.querySelector('.edit');
        this.editListener = () => params.edit(params.data)
        this.btnEdit.addEventListener('click', this.editListener);

        this.btnRemove = this.eGui.querySelector('.remove');
        this.removeListener = () => params.remove(params.data)
        this.btnRemove.addEventListener('click', this.removeListener);
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
        // do cleanup, remove event listener from button
        if (this.btnEdit) {
            // check that the button element exists as destroy() can be called before getGui()
            this.btnEdit.removeEventListener('click', this.editListener);
        }
        if (this.btnRemove) {
            // check that the button element exists as destroy() can be called before getGui()
            this.btnRemove.removeEventListener('click', this.removeListener);
        }
    }

    getValueToDisplay(params) {
        return params.valueFormatted ? params.valueFormatted : params.value;
    }
}

