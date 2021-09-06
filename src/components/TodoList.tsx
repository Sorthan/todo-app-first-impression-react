import {useState, useCallback, useEffect, useMemo} from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import './TodoListStyle.css';
import './modalStyle.css';
import Modal from 'react-modal';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CircularProgress } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

enum ShowStatus{
    NotRespond= 'NotRespond',
    Complete= 'Complete',
    Uncomplete= 'Uncomplete',
    All= 'All'
}

interface TodoData{
    id: number
    name: string
    isCompleted: boolean
}

function TodoList() {

    const [todos, setTodos] = useState<TodoData[]>([]);

    const [selectTodos, setSelectTodos] = useState<string>('');

    const [showtodos, setShowtodos] = useState<TodoData[]>([]);

    const [useModal, setUseModal] = useState(false);

    const [completeTodos, setCompleteTodos] = useState<TodoData[]>([]);

    const [uncompleteTodos, setUncompleteTodos] = useState<TodoData[]>([]);

    const path = 'http://todo-api.moveplus.dynu.net/api/v1'

    const queryClient = useQueryClient()

    const api = useMemo(() => (axios.create({
        baseURL: path
    })),[])

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchTodos = async () =>{
        await sleep(1000)
        /* return Promise.reject('error') */
        const res = await api.get(`/items`)
        return res.data.data.items;
    }

    const {data: tododata, status} = useQuery('todos', fetchTodos, {
        staleTime: 5*1000, refetchInterval:2*1000
    });

    const {data: data2, status: status2} = useQuery(['todos2', selectTodos], async () =>{
        await sleep(1000)
        const res = await api.get(`/items`)
        const data =  res.data.data.items
        const completedItems = todos.filter((todo) => todo.isCompleted===true)
        const uncompleteItems = todos.filter((todo) => todo.isCompleted===false)
        switch(selectTodos){
            case ShowStatus.Complete : {
                return completedItems
            }
            case ShowStatus.Uncomplete : {
                return uncompleteItems
            }
            default: {
                return data
            }
        }
    });

    const countCompleteTodo = useMemo(()=> {
        return completeTodos.length
    },[completeTodos])

    const countUncompleteTodo = useMemo(()=> {
        return uncompleteTodos.length
    },[uncompleteTodos])

    useEffect(() => {
        if(status === 'success'){
            setTodos(tododata)
        }
        const completedItems = todos.filter((todo) => todo.isCompleted===true)
        setCompleteTodos(completedItems);
        const uncompleteItems = todos.filter((todo) => todo.isCompleted===false)
        setUncompleteTodos(uncompleteItems);
        switch(selectTodos){
            case ShowStatus.NotRespond : {
                setShowtodos([])
                break;
            }
            case ShowStatus.Complete : {
                setShowtodos(completedItems)
                if(countCompleteTodo === 0){
                    setUseModal(true)
                }
                break;
            }
            case ShowStatus.Uncomplete : {
                setShowtodos(uncompleteItems)
                if(countUncompleteTodo === 0){
                    setUseModal(true)
                }
                break;
            }
            default: {
                setShowtodos(todos)
                break;
            }
        }
    },[tododata, todos, selectTodos])

    const addTodo = useCallback((todo: TodoData) => {
        if(!todo.name || /^\s*$/.test(todo.name)){
            return;
        }

        const newTodo = [todo, ...todos]

        addTodoMutation(todo.name)

        setTodos(newTodo)
        },[todos]

    )

    const {mutate:addTodoMutation} = useMutation((nameTodo : string) => api.post(`items/`, {name: nameTodo}), {
        onSuccess: () => {
            queryClient.invalidateQueries('todos')
            console.log("I'm adding to API")
        },
        onError: () => {
            console.log("I'm not adding to API")
        }
    })

    const updateTodo = useCallback((todoId: number, newValue: TodoData) => {
        if(!newValue.name || /^\s*$/.test(newValue.name)){
            return;
        }

        newValue.id = todoId
        updateTodoMutaion(newValue)

        setTodos((prev: any) => prev.map((item: any) => (item.id === todoId ? newValue : item)))
        },[todos]
    )

    const {mutate:updateTodoMutaion} = useMutation((newValue: TodoData) => api.patch(`items/${newValue.id}/name`, {name: newValue.name}), {
        onSuccess: () => {
            queryClient.invalidateQueries('todos')
            console.log("I'm updating to API")
        },
        onError: () => {
            console.log("I'm not updating to API")
        }
    })

    const removeTodo = useCallback((id: number) =>{
        const removeArray = todos.filter(todo => todo.id != id)
        
        removeTodoMutation(id)
        
        setTodos(removeArray)
        },[todos]
    )

    const {mutate:removeTodoMutation} = useMutation((idToDelete: number) => api.delete(`items/${idToDelete}`), {
        onSuccess: () => {
            queryClient.invalidateQueries('todos')
            console.log("I'm removing to API")
        },
        onError: () => {
            console.log("I'm not removing to API")
        }
    })

    const completeTodo = useCallback((id: number) => {
        let updatedTodos = todos.map((todo: TodoData) => {
            if(todo.id === id){
                todo.isCompleted = !todo.isCompleted
                if(todo.isCompleted){
                    console.log("This item is Completed")
                }
                else{
                    console.log("This item isn't Completed")
                }
                completeTodoMutation(todo)
            }
            return todo
        })
        setTodos(updatedTodos);
        },[todos]
    )

    const {mutate:completeTodoMutation} = useMutation((todo: TodoData) => api.patch(`/items/${todo.id}/flag`, {
        isCompleted : todo.isCompleted
        }), {
            onSuccess: () => {
                console.log('success to toggle')
                queryClient.invalidateQueries('todos')
            },
            onError: () => {
                console.log('error to check')
            }
        }
    )

    const OutputManage = (event: React.ChangeEvent<HTMLSelectElement>) =>{
        setSelectTodos(event.target.value)
        console.log(event.target.value)
    }

    const closeModal = () => {
        setUseModal(false)
        setSelectTodos(ShowStatus.NotRespond)
        console.log("close")
    }

    return (
        <div className="DisplayOutput">
            <h1 className="Todo-h1">works to be done</h1>
            <TodoForm onSubmit={addTodo} />
            <select className="DropDown" onChange={OutputManage}>
                <option value={ShowStatus.All}>All</option>
                <option value={ShowStatus.Complete}>Complete</option>
                <option value={ShowStatus.Uncomplete}>Uncomplete</option>
            </select>
            <div>
                {status === 'loading' &&(
                    <div className="Status-text">
                        LOADING DATA
                        <CircularProgress />
                    </div>
                )}
                {status === 'error' &&(
                    <div className="Status-text">
                        <ErrorIcon className="error-progress"/>
                        ERROR TO ACCESS API
                    </div>
                )}
                {status === 'success' &&(
                    <div>
                        <section>
                            <Todo todos={showtodos} completeTodo={completeTodo} removeTodo={removeTodo} updateTodo={updateTodo} />
                        </section>
                        <Modal 
                            isOpen={useModal}
                            className="modal"
                        >
                            <div className="AlertText">ALERT</div>
                            <div className="AlertText-comment">DON'T HAVE TODO ITEM HERE!!</div>
                            <button className="CloseButton" onClick={closeModal}>
                                <CloseIcon className="CloseIcon"/>
                            </button>
                        </Modal>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TodoList
