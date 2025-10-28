import { combineReducers } from 'redux';
import drawerReducer from './drawerReducer';
import cartReducer from './cartReducer';
import wishListReducer from './wishListReducer';
import userReducer from './userReducer'

const rootReducer = combineReducers({
    drawer: drawerReducer,
    cart: cartReducer,
    wishList : wishListReducer,
    user : userReducer
});

export default rootReducer;


