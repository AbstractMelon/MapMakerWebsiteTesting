const initialState = {
    rectangles: [],
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_RECTANGLE':
        return {
          ...state,
          rectangles: [...state.rectangles, action.payload],
        };
      case 'DELETE_RECTANGLE':
        return {
          ...state,
          rectangles: state.rectangles.filter((_, index) => index !== action.payload),
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  