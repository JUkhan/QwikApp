
import { $, type QRL, component$, useContext} from '@builder.io/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';
import { useForm, valiForm$ } from '@modular-forms/qwik';
import {  type Input, object, string,regex } from 'valibot';
import { AppContext, AddedMessage, UpdatedMessage } from "~/lib/users";
import prisma from "~/lib/prismaClient";
import { server$ } from '@builder.io/qwik-city';

const ServiceSchema = object({
  amount: string([regex(/^[0-9]\d*(\.\d+)?$/,"Not a valid number")]),
  availableAmount: string([regex(/^[0-9]\d*(\.\d+)?$/,"Not a valid number")])
});

type ServiceForm = Input<typeof ServiceSchema>;

const save = server$(async (data: ServiceForm, id: number) => {
  if(id){
    const service = await prisma.transaction.update({where:{id}, data:{amount:+data.amount, availableAmount:+data.availableAmount}});
    return service;
  }
  
});

export default component$(() => {
  const state = useContext(AppContext);
  const [serviceForm, { Form, Field }] = useForm<ServiceForm>({
    loader: {value:{amount:state.formData.amount.toString(), availableAmount:state.formData.availableAmount.toString()}},
    validate: valiForm$(ServiceSchema),
  });
  
  const handleSubmit: QRL<SubmitHandler<ServiceForm>> = $(async (data: ServiceForm) => {
    const id =state.formData.id;
    const res= await save(data, id);
    state.formData=res;
    state.toast={type:'success', msg:id?UpdatedMessage:AddedMessage};
    state.hide();
  });
 
  return (
    <Form onSubmit$={handleSubmit}>
      <div class="formContainer">
        <div class="formHeader">
          {state.formData.id?'Update':'Add'} Gift
        </div>
        <div class="formBody">
          <Field name="amount">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Vendor amount</span>
                </label>
                <input {...props} value={field.value} class="formInput"/>
                    
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>
          <Field name="availableAmount">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Available Amount</span>
                </label>
                <input {...props} value={field.value} class="formInput"/>
                    
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>
         
        </div>
        <div class="formFooter" style={{width:'100%'}}>
          <div>
            <button onClick$={()=>state.hide()} type="button" class="formBtnCancel">Cancel</button>
            <button disabled={serviceForm.invalid} type="submit" class="formBtnSave">Save</button>
          </div>
        </div>
      </div>
    </Form>
  );
});
