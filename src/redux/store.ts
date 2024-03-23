import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './reducers/authSlice';
import empresaReducer from './reducers/empresaSlice';
import aboutReducer from './reducers/aboutSlice';
import paisInfoReducer from './reducers/paisInfoSlice';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

// Configuración de Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth'],
};

// Se deben de inicializar el persistReducer que vamos a usar
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedEmpresaReducer = persistReducer(persistConfig, empresaReducer);
const persistedAboutReducer = persistReducer(persistConfig, aboutReducer);
const persistedPaisInfoReducer = persistReducer(persistConfig, paisInfoReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    empresa: persistedEmpresaReducer,
    about: persistedAboutReducer,
    paisInfo: persistedPaisInfoReducer,

    // aca van más reducers una vez persistidos
  }, middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;