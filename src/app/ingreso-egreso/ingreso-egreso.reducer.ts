import { createReducer, on } from '@ngrx/store';
import { setItems, unsetItems } from './ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AppState } from '../app.reducer';

export interface State {
    items: IngresoEgreso[]; 
}

export interface AppStateWithIngreso extends AppState{
    ingresosEgresos:State
}
export const initialState: State = {
   items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,

    on(setItems, (state,{ items }) => ({...state, items : [ ...items ]})),
    on(unsetItems, state => ({ ...state, items:[]})),

);

export function ingresoEgresoReducer(state:any, action:any) {
    return _ingresoEgresoReducer(state, action);
}