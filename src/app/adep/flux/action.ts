//这里是所有代码的共通的逻辑代码，所以想研究一下，接下来写一下每一句的意思。
//导入reflect-metadata（功能不明）
import 'reflect-metadata';
//导入Dispatcher（中文名：调度员）
import { Dispatcher } from '../flux';
//导入Dispatcher（中文名：注射工具）
import { InjectionUtils } from '../utils/';

//导出命名空间SystemErrorActionType
export namespace SystemErrorActionType {
    //导出常量SYSTEM_ERROR字符串
    export const SYSTEM_ERROR: string = 'SYSTEM_ERROR';
}

//导出抽象类Action（中文名：动作）
export abstract class Action {
    //定义一个调度员
    protected dispatcher;
    //定义动作的构造函数
    constructor() {
        this.dispatcher = InjectionUtils.injector.get(Dispatcher);
    }
}

//导出一个方法ActionBind（中文名：动作绑定）
//参数：actionType（动作类型）
export function ActionBind(actionType: string): any {
    //Reflect.getMetadata("design:returntype", target, key) 可以分别获取函数参数类型和返回值类型。
    //Reflect.getMetadata("actionBind", {actionType: actionType}) 可以分别获取动作绑定和动作类型。
    return Reflect.metadata('actionBind', {
        actionType: actionType
    });
}
