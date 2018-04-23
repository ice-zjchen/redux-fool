## Functions

<dl>
<dt><a href="#mapActionHandlers">mapActionHandlers(reducers, initialState)</a> ⇒ <code>function</code></dt>
<dd><p>组合多个reducers</p>
</dd>
<dt><a href="#defineActionType">defineActionType()</a></dt>
<dd><p>定义actionType</p>
<pre><code class="lang-javascript">// app/module/ACTION_TYPE
defineActionType(&#39;app&#39;)(&#39;module&#39;)(&#39;ACTION_TYPE&#39;)
</code></pre>
</dd>
<dt><a href="#makeActionCreator">makeActionCreator(actionType, payload, meta)</a></dt>
<dd><p>同步action构造器</p>
</dd>
<dt><a href="#makeAsyncActionCreator">makeAsyncActionCreator(actionType, callAPI, meta)</a></dt>
<dd><p>异步action构造器</p>
</dd>
<dt><a href="#createAsyncActionReducers">createAsyncActionReducers(actionType, requestHandler, successHandler, failureHanlder)</a></dt>
<dd><p>异步action的reducers构造器</p>
</dd>
<dt><a href="#createAsyncActionResponseSelector">createAsyncActionResponseSelector(actionName, actionParams)</a></dt>
<dd><p>异步action返回结果（response）选择器的构造函数</p>
</dd>
<dt><a href="#createAsyncActionDataSelector">createAsyncActionDataSelector(actionName, actionParams)</a></dt>
<dd><p>异步action返回数据（response.data）选择器的构造函数</p>
</dd>
<dt><a href="#createAsyncActionErrorSelector">createAsyncActionErrorSelector(actionName, actionParams)</a></dt>
<dd><p>异步action返回错误（response.error）选择器的构造函数</p>
</dd>
</dl>

<a name="mapActionHandlers"></a>

## mapActionHandlers(reducers, initialState) ⇒ <code>function</code>
组合多个reducers

**Kind**: global function  
**Returns**: <code>function</code> - slice reducers  

| Param | Type | Description |
| --- | --- | --- |
| reducers | <code>Object</code> | actionType和reducer的映射，<actionType, reducer> |
| initialState | <code>Object</code> | 初始state |

<a name="defineActionType"></a>

## defineActionType()
定义actionType

```javascript
// app/module/ACTION_TYPE
defineActionType('app')('module')('ACTION_TYPE')
```

**Kind**: global function  
<a name="makeActionCreator"></a>

## makeActionCreator(actionType, payload, meta)
同步action构造器

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| actionType | <code>string</code> | action类型 |
| payload | <code>Object</code> \| <code>function</code> | 参数 |
| meta | <code>Object</code> | 配置 |

<a name="makeAsyncActionCreator"></a>

## makeAsyncActionCreator(actionType, callAPI, meta)
异步action构造器

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| actionType | <code>string</code> |  | action类型 |
| callAPI | <code>function</code> |  | api请求promise |
| meta | <code>Object</code> |  | 配置 |
| meta.async | <code>boolean</code> | <code>true</code> | 是否异步 |
| meta.shouldCallAPI | [<code>shouldCallAPI</code>](#makeAsyncActionCreator..shouldCallAPI) |  | 是否调用API |
| meta.once | <code>boolean</code> | <code>false</code> | 同一请求（路径+参数）仅调用一次，必须提供参数`selectQuerySet` |
| meta.selectQuerySet | [<code>selectQuerySet</code>](#makeAsyncActionCreator..selectQuerySet) |  | API请求的结果池 |
| meta.cocurrent | <code>boolean</code> | <code>false</code> | 是否并发，默认为false，pendingMutex为1时不会发出请求 |
| meta.withTableUpdate | [<code>withTableUpdate</code>](#makeAsyncActionCreator..withTableUpdate) |  | normalizr的配置 |


* [makeAsyncActionCreator(actionType, callAPI, meta)](#makeAsyncActionCreator)
    * [~shouldCallAPI(state, action)](#makeAsyncActionCreator..shouldCallAPI) ⇒ <code>boolean</code>
    * [~selectQuerySet(state)](#makeAsyncActionCreator..selectQuerySet) ⇒ <code>Object</code>
    * [~withTableUpdate(tableName, selectEntities)](#makeAsyncActionCreator..withTableUpdate)

<a name="makeAsyncActionCreator..shouldCallAPI"></a>

### makeAsyncActionCreator~shouldCallAPI(state, action) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>makeAsyncActionCreator</code>](#makeAsyncActionCreator)  
**Returns**: <code>boolean</code> - 是否调用API  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Object</code> | 当前store中的state |
| action | <code>Object</code> | action对象 |

<a name="makeAsyncActionCreator..selectQuerySet"></a>

### makeAsyncActionCreator~selectQuerySet(state) ⇒ <code>Object</code>
中间件将会执行selectQuerySet(state)得到结果池
```
selectQuerySet = (state) => state.customer.getCustomerList
```
在根据请求的参数stringify后的paramsKey，从结果池中获取所要的结果

**Kind**: inner method of [<code>makeAsyncActionCreator</code>](#makeAsyncActionCreator)  
**Returns**: <code>Object</code> - 根据paramsKey获取的结果  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Object</code> | 当前store中的state |

<a name="makeAsyncActionCreator..withTableUpdate"></a>

### makeAsyncActionCreator~withTableUpdate(tableName, selectEntities)
**Kind**: inner method of [<code>makeAsyncActionCreator</code>](#makeAsyncActionCreator)  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>Object</code> | 表名，即entities[tableName] |
| selectEntities | <code>function</code> | 根据传入的返回数据data，给出最终normalizr的结果 |

<a name="createAsyncActionReducers"></a>

## createAsyncActionReducers(actionType, requestHandler, successHandler, failureHanlder)
异步action的reducers构造器

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| actionType | <code>string</code> |  | actionType |
| requestHandler | <code>\*</code> | <code></code> | 自定义REQUEST处理函数 |
| successHandler | <code>\*</code> | <code></code> | 自定义SUCCESS处理函数 |
| failureHanlder | <code>\*</code> | <code></code> | 自定义FAILURE处理函数 |

<a name="createAsyncActionResponseSelector"></a>

## createAsyncActionResponseSelector(actionName, actionParams)
异步action返回结果（response）选择器的构造函数

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| actionName | <code>string</code> | action函数名 |
| actionParams | <code>Object</code> | 请求参数 |

<a name="createAsyncActionDataSelector"></a>

## createAsyncActionDataSelector(actionName, actionParams)
异步action返回数据（response.data）选择器的构造函数

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| actionName | <code>string</code> | action函数名 |
| actionParams | <code>Object</code> | 请求参数 |

<a name="createAsyncActionErrorSelector"></a>

## createAsyncActionErrorSelector(actionName, actionParams)
异步action返回错误（response.error）选择器的构造函数

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| actionName | <code>string</code> | action函数名 |
| actionParams | <code>Object</code> | 请求参数 |

