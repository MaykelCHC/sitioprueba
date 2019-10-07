/**
 * Created by Yordan E. Estrada Rodriguez on 29/10/2018.
 */

var maxInWeb = 4;
var currentInWeb = 0;

var storeTratamientos = '';
var metodoCargarTratamientos = 'listartratamientos';
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
        renderTo: 'jtratamientos',
        id: 'panelTratamientos',
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
                    tooltip: 'Adiciona un Tratamiento',
                    icon   : '../Template/purple-vertical/assets/icons/iconAddNew2.png',
                    id: 'id-btn-AdicionarTratamientos',
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
        items: [obtenerTablaTratamientos(limites.getAt(0).get('limit'))],
        listeners: {
            add: function (vtn, component, index, eOpts) {
                component.getStore().load(
                    function(records, operation, success) {
                        var it = Ext.JSON.decode(operation.response.responseText);
                        seleccionable = it.seleccionable;
                });
            }
        }
    });
});

obtenerTablaTratamientos = function (newValue) {
    return Ext.create('Ext.grid.Panel', {
        id: 'gridTratamientos',
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
        store: obtenerStoreTratamientos(newValue),
        columns: obtenerColumnasTratamientos(),
        bbar: Ext.create('Ext.PagingToolbar', {
            store: storeTratamientos,
            displayInfo: true
        }),
    });
}

obtenerStoreTratamientos = function (pageSize) {
    Ext.define('modelTratamientos', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id_tratamiento', type: 'int'},
            {name: 'nombre', type: 'string'},
            {name: 'precio', type: 'integer'},
            {name: 'componente1', type: 'string'},
            {name: 'componente2', type: 'string'},
            {name: 'componente3', type: 'string'},
            {name: 'componente4', type: 'string'},
            {name: 'imagen', type: 'string'},
            {name: 'website', type: 'bool'},
        ],
        proxy: {
            type: 'ajax',
            url: metodoCargarTratamientos,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total',
                idProperty: 'id_tratamiento',
                successProperty: 'success',
                messageProperty: 'message'
            },
            writer: {type: 'json'}
        }
    });

    storeTratamientos = Ext.create('Ext.data.Store', {
        model: 'modelTratamientos',
        pageSize: pageSize,
        id: 'idStoreTratamientos',
        sorters: [{property: 'id_tratamiento', direction: 'ASC'}],
        listeners:{
            load:function(view, records, successful, eOpts ){
                currentInWeb= view.proxy.reader.jsonData.inweb;
            }
        }
    });
    return storeTratamientos;
}


obtenerColumnasTratamientos = function () {
    return [
        Ext.create('Ext.grid.RowNumberer'),
        {
            text: 'Nombre',
            dataIndex: 'nombre',
            menuDisabled: true,
            sortable: false,
            flex: 1,
            editor: {autoHeight: true, allowBlank: false}
        }, {
            text: 'Precio',
            dataIndex: 'precio',
            flex: 1,
            menuDisabled: true,
            sortable: false,
        }, {
            text: 'Componente 1',
            dataIndex: 'componente1',
            flex: 2,
            menuDisabled: true,
            sortable: false,
        }, {
        text: 'Componente 2',
            dataIndex: 'componente2',
            flex: 2,
            menuDisabled: true,
            sortable: false,
        }, {
            text: 'Componente 3',
            dataIndex: 'componente3',
            flex: 2,
            menuDisabled: true,
            sortable: false,
        },{
            text: 'Componente 4',
            dataIndex: 'componente4',
            flex: 2,
            menuDisabled: true,
            sortable: false,
        },{
            text        : 'Imagen',
            dataIndex   : 'imagen',
            align:"center",
            flex        : 1,
            menuDisabled: true,
            sortable    : false,
            renderer: function(value, meta, rec){
                return '<img src="../public/images/tratamientos/'+rec.get('imagen')+'" height="30px"/>';
            }
        },{
            xtype: 'checkcolumn',
            text: 'Website',
            menuDisabled: true,
            dataIndex: 'website',
            listeners:{
                'beforecheckchange': function(){
                    return false;
                }
    },
    flex: 1,
}, {
    text: 'Acciones',
    menuDisabled: true,
    align: 'center',
    sortable: false,
    xtype: 'actioncolumn',
    flex: 1,
    items: [{
        icon   : '../Template/purple-vertical/assets/icons/editar.png',
        tooltip: 'Editar Tratamiento',
        handler: function (grid, rowIndex, colIndex, item, e, record) {
            abrirVentana(record);
        }
    },'->',{
        icon: '../Template/purple-vertical/assets/icons/eliminar.png',
        tooltip: 'Eliminar Tratamiento',
        handler: function (grid, rowIndex, colIndex, item, e, record) {
            Ext.MessageBox.confirm('Confirmaci&oacute;n', '¿Desea eliminar el elemento seleccionado?',  function (btn) {
                if (btn == 'yes') {
                    storeTratamientos.remove(record);
                    var myform = Ext.create('Ext.form.Panel',{
                        url: metodoCargarTratamientos,
                        items:[{
                            xtype:'numberfield',
                            name:'id_tratamiento',
                            value:record.get('id_tratamiento')
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
                            actualizarTratamientos();
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
    var name = 'Agregar tratamiento';
    var icon = '../Template/purple-vertical/assets/icons/iconAddNew2.png';
    var deshabilitado = true;

    if(currentInWeb < maxInWeb)
        deshabilitado = false;

    if(object != null){
        name= 'Editar tratamiento';
        icon = '../Template/purple-vertical/assets/icons/eliminar.png';

        if(object.get('website'))
            deshabilitado = false;
    }

    var myform = Ext.create('Ext.form.Panel',{
        url: metodoCargarTratamientos,
        fileUpload: true,
        border:false,
        fieldDefaults: {
            labelAlign: 'top',
            anchor: '100%'
        },
        items:[{
            xtype:'numberfield',
            name:'id_tratamiento',
            hidden:true,
            value:object!= null? object.get('id_tratamiento'):null
        },{
            xtype:'textfield',
            name:'metodo',
            hidden:true,
            value:object!= null? 'actualizar':'adicionar'
        },{
            xtype:'textfield',
            fieldLabel: 'Nombre del tratamiento',
            name:'nombre',
            allowBlank: false,
            value:object!= null? object.get('nombre'):null
        },{
            xtype:'panel',
            layout:'hbox',
            items:[{
                xtype:'numberfield',
                fieldLabel: 'Precio',
                decimalSeparator:'.',
                hideTrigger:true,
                width: 100,
                allowBlank: false,
                name:'precio',
                value:object!= null? object.get('precio'):null
            },{
                xtype:'checkbox',
                labelAlign: 'right',
                labelWidth :110,
                margin: '40 0 0 60',
                fieldLabel: 'Ver en la Web',
                name:'website',
                checked:object!= null? object.get('website'):false,
                readOnly: deshabilitado
            }]
        },{
            xtype:'textfield',
            fieldLabel: 'Componente 1',
            name:'componente1',
            allowBlank: true,
            value:object!= null? object.get('componente1'):null
        },{
            xtype:'textfield',
            fieldLabel: 'Componente 2',
            name:'componente2',
            allowBlank: true,
            value:object!= null? object.get('componente2'):null
        },{
            xtype:'textfield',
            fieldLabel: 'Componente 3',
            name:'componente3',
            allowBlank: true,
            value:object!= null? object.get('componente3'):null
        },{
            xtype:'textfield',
            fieldLabel: 'Componente 4',
            name:'componente4',
            allowBlank: true,
            value:object!= null? object.get('componente4'):null
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
                            actualizarTratamientos();
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

actualizarTratamientos = function () {
    storeTratamientos.load();
}

reconfigurarTabla = function (newValue) {
    Ext.destroy(Ext.getCmp('gridTratamientos'));
    Ext.getCmp('panelTratamientos').add(obtenerTablaTratamientos(newValue));
}

