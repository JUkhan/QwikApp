
import { $, type QRL, component$, useContext, useSignal } from '@builder.io/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';
import { useForm, valiForm$ } from '@modular-forms/qwik';
import {  type Input, minLength, object, string } from 'valibot';
import { AppContext, AddedMessage, UpdatedMessage } from "~/lib/users";
import prisma from "~/lib/prismaClient";
import { server$ } from '@builder.io/qwik-city';

const ServiceSchema = object({
  name: string([
    minLength(1, 'Please enter the service name.')
  ]),
  type: string(),
  description: string(),
  contact: string(),
  city: string(),
  address: string(),
  mediaLink: string(),
});

type ServiceForm = Input<typeof ServiceSchema>;

const save = server$(async (data: ServiceForm, id: number) => {
  if(id){
    const service = await prisma.service.update({where:{id}, data});
    return service;
  }else{
    const service = await prisma.service.create({data});
    return service;
  }
  
});

export default component$(() => {
  const state = useContext(AppContext);
  const initForm = useSignal(state.formData);
  const [serviceForm, { Form, Field }] = useForm<ServiceForm>({
    loader: initForm,
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
    <Form onSubmit$={handleSubmit} >
      <div class="formContainer">
        <div class="formHeader">
          {state.formData.id?'Update':'Add'} Service
        </div>
        <div class="formBody">
          <Field name="name">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Name</span>
                </label>
                <input {...props} type="text" value={field.value} class="formInput" />
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>
         
          <Field name="type">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Type</span>
                </label>
                <input {...props} type="text" value={field.value} class="formInput" />
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>

          <Field name="description">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Description</span>
                </label>
                <input {...props} type="text" value={field.value} class="formInput" />
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>

          <Field name="contact">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Contact</span>
                </label>
                <input {...props} type="text" value={field.value} class="formInput" />
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>

          <Field name="city">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>City</span>
                </label>
                <input {...props} type="text" value={field.value} class="formInput" />
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>

          <Field name="address">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Address</span>
                </label>
                <input {...props} type="text" value={field.value} class="formInput" />
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>

          <Field name="mediaLink">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>MediaLink</span>
                </label>
                <input {...props} type="text" value={field.value} class="formInput" />
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
