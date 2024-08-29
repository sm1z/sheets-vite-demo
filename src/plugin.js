import { runOnLifecycle, ICommandService, setDependencies, DependentOn, IContextService, ILocalStorageService, Inject, Injector, OnLifecycle, LifecycleStages, Disposable, UniverInstanceType, CommandType, Plugin } from "@univerjs/core"
import { ComponentManager, IMenuService, MenuItemType,MenuPosition, } from "@univerjs/ui"
import { exportButtonIcon } from './icon';
// 菜单项配置
function CustomMenuItemExportButtonFactory(){
    return {
        id: exportButtonOperation.id, 
        type: MenuItemType.id,
        icon: "导出FMEA表格",
        tooltip: "导出FMEA1",
        title:"导出FMEA2",
        positions: [MenuPosition.TOOLBAR_START],
    }
}

// 提前注册好图标
// function exportButtonIcon(){
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
//           <path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m.16 14a6.981 6.981 0 0 0-5.147 2.256A7.966 7.966 0 0 0 12 20a7.97 7.97 0 0 0 5.167-1.892A6.979 6.979 0 0 0 12.16 16M12 4a8 8 0 0 0-6.384 12.821A8.975 8.975 0 0 1 12.16 14a8.972 8.972 0 0 1 6.362 2.634A8 8 0 0 0 12 4m0 1a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4" />
//         </svg>
//       );
// }
// 注册菜单前，需要构造一个Command，这个Command会在菜单被点击时执行
const exportButtonOperation = {
    id: 'custom-menu.operation.export-button',
    type: CommandType.OPERATION,
    handler: async(accessor) => {
        console.log(accessor)
        alert('Single button operation')
        return true
    }
}
// 构造一个controller类，用于注册菜单项命令、菜单项图标、菜单项配置。
class UniverExportUIPlugin extends Disposable {
    constructor(
        _injector,
        _commandService,
        _menuService, 
        _componentManager,

    ){
        console.log("UniverExportUIPlugin")
        super() 
        this._injector = _injector
        this._commandService = _commandService
        this._menuService = _menuService
        this._componentManager = this._componentManager

        this._initCommands() 
        this._registerComponents()
        this._initMenus() 
    }   
    _initCommands(){
        const self = this 
        console.log('_initCommands', this.disposeWithMe)
        console.log('-----')
        console.log('this._commandService.registerCommand', this._commandService.registerCommand)
        console.log(exportButtonOperation) 
        [
            exportButtonOperation
        ].forEach((command) => this.disposeWithMe(this._commandService.registerCommand(command)));
    }
    _registerComponents(){
        console.log('_registerComponents')
        this.disposeWithMe(this._componentManager.register("exportButtonIcon", exportButtonIcon));
    }
    _initMenus(){
        console.log("注册了一个导出UI")
        [CustomMenuItemExportButtonFactory].forEach(factory => {
            this.disposeWithMe(this._menuService.addMenuItem(this._injector.invoke(factory), {}));
        })
    }
}
runOnLifecycle(LifecycleStages.Steady, UniverExportUIPlugin)
setDependencies(UniverExportUIPlugin, [Injector, ICommandService, IMenuService, ComponentManager])
// setDependencies(UniverExportUIPlugin, [Injector, ICommandService])

// 将这个controller注册到插件中
// @DependentOn(UniverSheetsExportMenuPlugin)
export class UniverSheetsExportMenuPlugin extends Plugin {
    static type = UniverInstanceType.UNIVER_SHEET;
    static pluginName = "SHEET_EXPORT_UI_PLUGIN"
    constructor( 
        _injector,
        _commandService,
    ){
        super();
        this._injector = _injector
        this.commandService = _commandService
    }
    onStarting(injector){        
        const dependencies = [
            [UniverExportUIPlugin]
        ]
        dependencies.forEach(d => this._injector.add(d))

    }
}
setDependencies(UniverSheetsExportMenuPlugin, [Injector, ICommandService])
