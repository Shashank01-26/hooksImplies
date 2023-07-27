import React,{useState,useEffect,useContext,useRef,useMemo,useCallback, useReducer} from 'react'



const initialState = {
  todos:[],

}

const todoReducer = (state, action) => {
  switch(action.type){
  case "ADD_TODO":
    return {todos:[...state.todos, action.payload] };
  
  case "TOGGLE_TODO":
    return {
      todos: state.todos.map(todo => 
        todo.id === action.payload ? {...todo,completed: !todo.completed} :todo
        ),
    };

    case "REMOVE_TODO":
      return {todos: state.todos.filter(todo => todo.id !== action.payload)};
      default:
        return state;

  }
};

const TodoContext = React.createContext();

const TodoList = () =>{

const [state,dispatch] = useReducer(todoReducer, initialState);
const [newTodo, setNewTodo] = useState(' ');

useEffect(() => {

const storedTodos = JSON.parse(localStorage.getItem('todos'));
if(storedTodos){
  dispatch({type: "ADD_TODO", payload:storedTodos});
}

},[]);

useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(state.todos));
},[state.todos]);

const completeTodosCount = useMemo(() => {
  return state.todos.filter(todo => todo.completed).length;

},[state.todos]);

const inputRef = useRef(null);

const addTodo = useCallback(()=>{
  if(newTodo.trim() !== ' '){
    const newTodoItem = {
      id:Date.now(),
      text: newTodo,
      completed:false,
    };
    dispatch({type: 'ADD_TODO',payload:newTodoItem});
    setNewTodo(' ');
    inputRef.current.focus();
  }
},[newTodo]);

const toggleTodo = useCallback(id => {
  dispatch({type: 'TOGGLE_TODO',payload:id});
},[]);

const removeTodo = useCallback(id => {
dispatch({type:'REMOVE_TODO',payload:id});

},[]);

return (
<TodoContext.Provider value={{todos:state.todos, toggleTodo,removeTodo}}>
  <div>
    <input 
      type='text'
      value={newTodo}
      onChange={e => setNewTodo(e.target.value)}
      ref={inputRef}
    />
<button onClick={addTodo}>Add Todo</button>
<p>Completed Todos:{completeTodosCount}</p>
<ul>
{state.todos.map(todo => (
  <TodoItem key={todo.id} todo={todo}/>
))}
</ul>
  </div>
</TodoContext.Provider>
);
};

const TodoItem = ({todo}) =>{
  const {toggleTodo, removeTodo} = useContext(TodoContext);
return (
  <li>
<input 
type='checkbox'
checked={todo.completed}
onChange={()=> toggleTodo(todo.id)}
/>
<span style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>
  {todo.text}
</span>
<button onClick={()=>removeTodo(todo.id)}>Remove</button>
</li>
);
};

export default TodoList;