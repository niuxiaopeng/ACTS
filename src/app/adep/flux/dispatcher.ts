//导入Injectable（中文名：注入器）装饰器，只有这样，才能把参数的类型在生成的ES5文件中，有参数类型。（https://segmentfault.com/a/1190000009645391）
import { Injectable } from '@angular/core';
//导入接口Payload（数据和动作类型）
import { Payload } from './payload';
//导入State（状态，但没有用）
import { State } from './state';
//导入（Store，商店）
import { Store } from './store';

//定义ActionHolder（动作支架）
class ActionHolder {
    //定义成员属性：stores数组类型（实例，方法）
    private stores: Array<{ instance: any, methodName: string }>;

    //定义构造方法，参数（动作类型）
    constructor(private actionType: string) {
        //实例化成员属性
        this.stores = [];
    }

    //定义方法add（实例，方法）
    public add(instance: Store<any>, methodName: string) {
        //调用成员属性的方法map，查看要添加的实例是否在既存的数组中已经存在了？如果存在，直接退出
        this.stores.map((item) => {
            if (item.instance === instance) {
                return;
            }
        });
        //否则，添加进成员属性
        this.stores.push({ instance, methodName });
    }

    //定义方法remove（实例：商店）
    public remove(instance: Store<any>) {
        //给成员属性stores赋值，不等于instance的所有元素组成的数组
        this.stores = this.stores.filter((item) => {
            return item.instance !== instance;
        });
    }

    //定义方法invoke（payload: Payload）
    public invoke(payload: Payload) {
        //商店里每个成员item
        this.stores.map((item) =>
            //item的实例的方法，运行payload的数据
            item.instance[item.methodName].apply(item.instance, [payload.data])
        );
    }
}

//注入器装饰器
@Injectable()
//导出类Dispatcher（调度员）
export class Dispatcher {
    //定义actionRepository（成员变量：动作资料库）
    private actionRepository: {
        //key：动作支架
        [key: string]: ActionHolder
    } = {};

    //定义构造方法
    constructor() {
        //打印记录
        console.log('Dispatcher#constructor');
    }

    //定义方法dispatch（调度）
    public dispatch(payload: Payload) {
        //定义动作支架常量，按照payload的动作类型，取出成员变量的动作支架
        const actionHolder = this.actionRepository[payload.actionType];
        //如果取出来的动作支架是空，就直接返回
        if (actionHolder == null) {
            return;
        }
        //如果不是，直接运行actionHolder里面的invoke
        actionHolder.invoke(payload);
    }

    //定义方法注册register（动作类型，来源，方法）
    public register(actionType: string, target: any, methodName: string) {
        //定义动作支架（从成员变量中按照动作类型取出）
        //这里很迷，两个对象ActionHolder进行或运算，结果还是个ActionHolder，这到底是怎么回事？
        const actionHolder = this.actionRepository[actionType] || new ActionHolder(actionType);
        //然后往常量actionHolder里面添加，来源和方法
        actionHolder.add(target, methodName);
        //然后更新成员属性的该动作类型的动作支架
        this.actionRepository[actionType] = actionHolder;
    }

    //定义方法注销（动作类型，来源）
    public unregister(actionType: string, target: any) {
        //定义动作支架（从成员变量中按照动作类型取出）
        const actionHolder = this.actionRepository[actionType];
        //如果取出来的动作支架是空，则直接返回
        if (actionHolder == null) {
            return;
        }
        //否则，移除该动作支架
        actionHolder.remove(target);
    }
}
