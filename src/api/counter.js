
export function increase(){
    return (dispatch)=>{
        setTimeout(function(){
            console.log('update counter');
            dispatch({type:"counter/increment"});
        }, 5000);
    }
    
}
export function decrease(){
    return (dispatch)=>{
        setTimeout(function(){
            console.log('update counter');
            dispatch({type:"counter/decrement"});
        }, 5000);
    }   
}
