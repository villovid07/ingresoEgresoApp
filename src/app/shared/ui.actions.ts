import { createAction } from '@ngrx/store';

export const isLoading = createAction('[UI Component] is Loading');
export const stopLoading = createAction('[UI Component] Stop loading');