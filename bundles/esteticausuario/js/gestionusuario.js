/**
 * Created by Maykel on 16/10/2018.
 */

//Variables para llevar cantidad a mostrar en la web
var storeUsuario = '';
var metodoCargarUsuario = 'cargarusuarios';
var limites = Ext.create('Ext.data.Store', {
    fields: ['limit'],
    data: [{"limit": 10}, {"limit": 25}, {"limit": 50}, {"limit": 100}]
});

actualizarContenedorPadre = function (componente_DOM) {
    Ext.getCmp(componente_DOM.children[0].id).setWidth( componente_DOM.clientWidth - componente_DOM.offsetLeft);
}

Ext.onReady(function () {

    Ext.QuickTips.init();

    Ext.create('Ext.panel.Panel', {
        renderTo: 'jgestionusuario',
        id: 'panelUsuarios',
        layout: 'fit',
        border: false,
        bodyStyle: {
            border: 0,
            padding: '10px'
        },
        dockedItems: [{
            xtype: 'toolbar',
            id: 'toolBarGestionNivelActividad',
            dock: 'top',
            items: [
                Ext.create('Ext.Button', {
                    text: 'Agregar',
                    tooltip: 'Adiciona un usuario',
                    icon: '../Template/purple-vertical/assets/icons/iconAddNew2.png',
                    id: 'id-btn-AdicionarUsuario',
                    handler: function () {
                        abrirVentana(null);
                    }
                }), '->',
                Ext.create('Ext.form.ComboBox', {
                    fieldLabel: 'Ver',
                    labelWidth: 30,
                    width:100,
                    store: limites,
                    queryMode: 'local',
                    displayField: 'limit',
                    valueField: 'limit',
                    value: 10,
                    listeners: {
                        change: function (combo, newValue, oldValue, eOpts) {
                            reconfigurarTabla(newValue);
                        }
                    }
                })
            ]
        }],
        items: [obtenerTablaUsuarios(limites.getAt(0).get('limit'))],
        listeners: {
            add: function (vtn, component, index, eOpts) {
                component.getStore().load();
            }
        }
    });
});

obtenerTablaUsuarios = function (newValue) {

    var grid = Ext.create('Ext.grid.Panel', {
        id: 'gridUsuarios',
        extend: 'Ext.grid.Panel',
        requires: 'Ext.ux.grid.FiltersFeature',
        multiSelect: false,
        border: true,
        border: 1,
        style: {borderColor: '#ec5598', borderStyle: 'solid'},
        height: 350,
        border: false,
        columnLines: true,
        viewConfig: {stripeRows: true},
        resizable: false,
        defaults: {autoScroll: true, align: 'center'},
        store: obtenerStoreUsuario(newValue),
        columns: obtenerColumnasUsuario(),
        bbar: Ext.create('Ext.PagingToolbar', {
            store: storeUsuarios,
            displayInfo: true
        })
    });
    return grid;
}

obtenerStoreUsuario = function (pageSize) {
    Ext.define('modelUsuario', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id_usuario', type: 'int'},
            {name: 'nombre'},
            {name: 'correo'},
            {name: 'clave'},
            {name: 'imagen', type:'fileuploadfield'}
        ],
        proxy: {
            type: 'ajax',
            url: metodoCargarUsuario,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total',
                idProperty: 'id_usuario',
                successProperty: 'success',
                messageProperty: 'message'
            },
            writer: {type: 'json'}
        }
    });

    storeUsuarios = Ext.create('Ext.data.Store', {
        model: 'modelUsuario',
        pageSize: pageSize,
        id: 'idStoreUsuarios',
        sorters: [{property: 'id_usuario', direction: 'ASC'}],
        listeners:{
            load:function(view, records, successful, eOpts ){

            }
        }
    });
    return storeUsuarios;
}

obtenerColumnasUsuario = function () {
    return [
        Ext.create('Ext.grid.RowNumberer'),
        {
            text        : 'Nombre',
            dataIndex   : 'nombre',
            menuDisabled: true,
            sortable    : false,
            flex        : 1,
        }, {
            text        : 'Correo',
            dataIndex   : 'correo',
            flex        : 1,
            menuDisabled: true,
            sortable    : false,
        },  {
            text        : 'Imagen',
            dataIndex   : 'imagen',
            align:"center",
            flex        : 1,
            menuDisabled: true,
            sortable    : false,
            renderer: function(value, meta, rec){
                return '<img src="../public/images/users/'+rec.get('imagen')+'" height="30px"/>';
            }
        }, {
            text        : 'Acciones',
            menuDisabled: true,
            align       : 'center',
            sortable    : false,
            xtype       : 'actioncolumn',
            flex        : 1,
            items: [{
                icon   : '../Template/purple-vertical/assets/icons/editar.png',
                tooltip: 'Editar Usuario',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    abrirVentana(record);
                }
            },'->',{
                icon   : '../Template/purple-vertical/assets/icons/eliminar.png',
                tooltip: 'Eliminar Usuario',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    Ext.MessageBox.confirm('Confirmaci&oacute;n', '¿Desea eliminar el elemento seleccionado?',  function (btn) {
                        if (btn == 'yes') {
                            storeUsuarios.remove(record);
                            var myform = Ext.create('Ext.form.Panel',{
                                url: metodoCargarUsuario,
                                items:[{
                                    xtype:'numberfield',
                                    name:'id_usuario',
                                    value:record.get('id_usuario')
                                },{
                                    xtype:'textfield',
                                    name:'metodo',
                                    value:'eliminar'
                                }]
                            });

                            myform.getForm().submit({
                                success: function (form, action) {
                                    var jsonDataResponse = action.result;
                                    $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                                    actualizarUsuario();
                                },
                                failure: function (form, action) {
                                    var jsonDataResponse = action.result;
                                    $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                                }
                            });

                        }
                    });
                }
            }]
        }];
}

abrirVentana = function(object){
    var name = 'Agregar usuario';
    var icon = '../Template/purple-vertical/assets/icons/iconAddNew2.png';

    var myform = Ext.create('Ext.form.Panel',{
        url: metodoCargarUsuario,
        fileUpload: true,
        border:false,
        fieldDefaults: {
            labelAlign: 'top',
            anchor: '100%'
        },
        items:[{
            xtype:'numberfield',
            name:'id_usuario',
            hidden:true,
            value:object!= null? object.get('id_usuario'):null
        },{
            xtype:'textfield',
            name:'metodo',
            hidden:true,
            value:object!= null? 'actualizar':'adicionar'
        },{
            xtype:'textfield',
            fieldLabel: 'Nombre',
            name:'nombre',
            allowBlank: false,
            value:object!= null? object.get('nombre'):null
        },{
            xtype:'textfield',
            fieldLabel: 'Correo',
            name:'correo',
            value:object!= null? object.get('correo'):null
        },{
            xtype:'textfield',
            fieldLabel: 'Clave',
            inputType:'password',
            name:'clave',
            value:null
        },{
            xtype     : 'fileuploadfield',
            allowBlank: false,
            name        : 'imagen',
            fieldLabel: 'Imagen',
            rawValue: object!= null? object.get('imagen'):null,
            emptyText: 'Seleccionar imagen'
        }]
    });

    var wind = Ext.widget('window', {
        title: name,
        icon:icon,
        border:false,
        layout:'form',
        width:350,
        modal : true,
        resizable :false,
        closable: true,
        closeAction: 'close',
        bodyStyle: 'padding: 15px;',
        defaultType: 'textfield',
        items: [myform],
        bbar :['->',{
            text:'Cerrar',
            width:100,
            handler:function(){
                wind.close();
            }
        },{
            text:'Guardar',
            width:100,
            handler:function(){
                if(myform.isValid() && myform.isDirty()) {
                    myform.getForm().submit({
                        success: function (form, action) {
                            var jsonDataResponse = action.result;
                            $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                            actualizarUsuario();
                        },
                        failure: function (form, action) {
                            var jsonDataResponse = action.result;
                            $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                        }
                    });
                    wind.close();
                }
            }
        }]
    }).show();
}

actualizarUsuario = function () {
    storeUsuarios.load();
}

reconfigurarTabla = function (newValue) {
    Ext.destroy(Ext.getCmp('gridUsuarios'));
    Ext.getCmp('panelUsuarios').add(obtenerTablaUsuarios(newValue));
}

