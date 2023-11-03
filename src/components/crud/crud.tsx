
import { $, type QRL, component$, useContext, useSignal } from '@builder.io/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';
import { useForm, valiForm$ } from '@modular-forms/qwik';
import { email, type Input, minLength, object, string } from 'valibot';
import { AppContext } from "~/lib/users";

const LoginSchema = object({
  email: string([
    minLength(1, 'Please enter your email.'),
    email('The email address is badly formatted.'),
  ]),
  password: string([
    minLength(1, 'Please enter your password.'),
    minLength(8, 'Your password must have 8 characters or more.'),
  ]),
});

type LoginForm = Input<typeof LoginSchema>;

export default component$(() => {
  const state = useContext(AppContext);
  const initForm = useSignal(state.formData);
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: initForm,
    validate: valiForm$(LoginSchema),
  });

  const handleSubmit: QRL<SubmitHandler<LoginForm>> = $((values: LoginForm) => {
    // Runs on client
    console.log(':::', values);
    state.hide();
  });

  return (
    <Form onSubmit$={handleSubmit} >
      <div class="formContainer">
        <div class="formHeader">
          {state.formData.id?'Update':'Add'} User
        </div>
        <div class="formBody">
          <Field name="email">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Email</span>
                </label>
                <input {...props} type="email" value={field.value} class="formInput" />
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>
          <Field name="password">
            {(field, props) => (
              <div class="form-control">
                <label class="formLabel">
                  <span>Password</span>
                </label>
                <input {...props} type="password" value={field.value} class="formInput" />
                {field.error && <div class="formError">{field.error}</div>}
              </div>
            )}
          </Field>

        </div>
        <div class="formFooter" style={{width:'100%'}}>
          <div>
            <button onClick$={()=>state.hide()} type="button" class="formBtnCancel">Cancel</button>
            <button disabled={loginForm.invalid} type="submit" class="formBtnSave">Save</button>
          </div>
        </div>
      </div>
    </Form>
  );
});
