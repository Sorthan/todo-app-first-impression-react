import {useState, useCallback} from 'react'
import TodoForm from './TodoForm'
import './TodoListStyle.css'
import './modalStyle.css'
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const Todo = (props: {todos: any[] , completeTodo: any , removeTodo: any , updateTodo: any}) => {

    const [edit, setEdit] = useState({
        id: null,
        name: '',
        isCompleted: false
    })

    const submitUpdate = useCallback((name: any) => {
        props.updateTodo(edit.id, name)
        setEdit({
            id: null,
            name: '',
            isCompleted: false
        })
    },[edit])

    if (edit.id){
        return( 
            <TodoForm edit={edit} onSubmit={submitUpdate} />           
        )
    }

    return <>{props.todos.map((todo: any) => (
        <div className = {todo.isCompleted ? 'Todo-isCompleteStyle' : 'Todo-isUncompleteStyle'}>
            <div>
                <button className={todo.isCompleted ? 'Todo-CheckCompleteButton' : 'Todo-CheckUncompleteButton'} onClick={props.completeTodo.bind(null, todo.id)}>
                    <CheckIcon />
                </button>
                {todo.name}
                <button className={todo.isCompleted ? 'Todo-EditCompleteButton' : 'Todo-EditUncompleteButton'} onClick={setEdit.bind(null, {id: todo.id, name: todo.name, isCompleted:todo.isCompleted})}>
                    <EditIcon />
                </button>
                <button  className={todo.isCompleted ? 'Todo-DeleteCompleteButton' : 'Todo-DeleteUncompleteButton'} onClick={props.removeTodo.bind(null, todo.id)} >
                    <DeleteIcon />
                </button>
            </div>    
        </div>
    ))}</>
}

export default Todo
