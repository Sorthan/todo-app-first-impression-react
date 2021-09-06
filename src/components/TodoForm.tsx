import './TodoForm.css'
import AddBoxIcon from '@material-ui/icons/AddBox';
import SaveIcon from '@material-ui/icons/Save';
import  {Form, Field} from 'react-final-form';

function TodoForm(props: any) {
    
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    
    const onSubmit = async(values: string) => {
        await sleep(300)
        props.onSubmit(values);
    }
    
    const required = (value: any) => (value ? undefined : "Required");
    let formData = {}

    return(
    <Form
        onSubmit={onSubmit}
        initialValues={formData}
        subscription={{ submitting: true }}
        render={({handleSubmit, submitting }) => (
            <form className="todo-form" onSubmit={handleSubmit}>
                <>{props.edit ? (
                    <Field name="name" validate={required}>
                        {({ input, meta }) => (
                            <div>
                                <input {...input} 
                                    type="text" 
                                    placeholder="Update The Work" 
                                    className="todo-input"
                                    maxLength={20}
                                />
                                {meta.error && meta.touched && <span>{meta.error}</span>}
                                <button className="todo-button" type="submit" disabled={submitting}>
                                    <SaveIcon className="ADDICON" />
                                </button>
                            </div>
                        )}
                    </Field>) : (
                    <Field name="name" validate={required}>
                        {({ input, meta }) => (
                            <div>
                                <input {...input} 
                                    type="text" 
                                    placeholder="Enter The Work" 
                                    className="todo-input"
                                    maxLength={20}
                                />
                                {meta.error && meta.touched && <span>{meta.error}</span>}
                                <button className="todo-button" type="submit" disabled={submitting}>
                                    <AddBoxIcon className="ADDICON" />
                                </button>
                            </div>
                        )}
                    </Field>)}
                </>
            </form>
        )}
    />
    )
}

export default TodoForm