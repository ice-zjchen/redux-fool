import { utils as reduxFoolUtils } from 'redux-fool';

const { defineActionType } = reduxFoolUtils;

const app = defineActionType('crm');
const task = app('task');

export const CREATE_TASK = task('CREATE_TASK');
