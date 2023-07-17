
export function increase(){
    return (dispatch)=>{
            dispatch({type:"counter/increment"});
    }
    
}
export function decrease(){
    return (dispatch)=>
            dispatch({type:"counter/decrement"});
}
