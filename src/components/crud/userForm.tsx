
import { $, type QRL, component$, useContext } from '@builder.io/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';
import { useForm, valiForm$ } from '@modular-forms/qwik';
import {  type Input, minLength, object, string } from 'valibot';
import { AppContext, AddedMessage, UpdatedMessage, UserRules } from "~/lib/users";
import prisma from "~/lib/prismaClient";
import { server$ } from '@builder.io/qwik-city';

const ServiceSchema = object({
  rules: string([minLength(1,'Invalid number value')])
  
});

type ServiceForm = Input<typeof ServiceSchema>;

const save = server$(async (data: ServiceForm, id: number) => {
  if(id){
    const service = await prisma.user.update({where:{id}, data});
    return service;
  }
  
});

export default component$(() => {
  const state = useContext(AppContext);
  const [serviceForm, { Form, Field }] = useForm<ServiceForm>({
    loader: {value:state.formData},
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
          {state.formData.id?'Update':'Add'} User Rule
        </div>
        <div class="formBody">
          <Field name="rules">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Change user rule</span>
                </label>
                <select {...props}  name="serviceId" value={field.value} class="formSelect">
                    <option value="">Select a Rule</option>
                    <option value={UserRules.user}>{UserRules.user}</option>
                    <option value={UserRules.admin}>{UserRules.admin}</option>        
                </select>
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
