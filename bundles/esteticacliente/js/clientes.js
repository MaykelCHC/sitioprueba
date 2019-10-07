/**
 * Created by Maykel on 16/10/2018.
 */

var storeClientes = '';
var storeTratamiento = '';
var storeSesiones = '';

var metodoCargarCliente = 'listar';
var limites = Ext.create('Ext.data.Store', {
    fields: ['limit'],
    data: [{"limit": 10}, {"limit": 25}, {"limit": 50}, {"limit": 100}]
});

Ext.onReady(function () {

    Ext.QuickTips.init();
    obtenerStoreTratamientos(200);
    obtenerStoreSesiones(200);

    Ext.create('Ext.panel.Panel', {
        renderTo: 'jclientes',
        id: 'panelClientes',
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
                    tooltip: 'Adiciona un cliente',
                    icon: '../Template/purple-vertical/assets/icons/iconAddNew2.png',
                    id: 'id-btn-AdicionarCliente',
                    handler: function () {
                        abrirVentana(null);
                    }
                }), '->',
                Ext.create('Ext.form.ComboBox', {
                    fieldLabel: 'Ver',
                    labelWidth: 30,
                    width: 100,
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
        items: [obtenerTablaClientes(limites.getAt(0).get('limit'))],
        listeners: {
            add: function (vtn, component, index, eOpts) {
                component.getStore().load();
            }
        }
    });
});

obtenerTablaClientes = function (newValue) {
    return Ext.create('Ext.grid.Panel', {
        id: 'gridClientes',
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
        store: obtenerStoreCliente(newValue),
        columns: obtenerColumnasCliente(),
        bbar: Ext.create('Ext.PagingToolbar', {
            store: storeClientes,
            displayInfo: true,

        })
    });
}

obtenerStoreCliente = function (pageSize) {
    Ext.define('modelCliente', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id_cliente', type: 'int'},
            {name: 'nombre'},
            {name: 'celular', type: 'integer'},
            {name: 'correo'},
            {name: 'fecha_creado', type: 'date', renderer: Ext.util.Format.dateRenderer('m/d/Y')},
            {name: 'alertas', type: 'bool'},
        ],
        proxy: {
            type: 'ajax',
            url: metodoCargarCliente,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total',
                idProperty: 'id_cliente',
                successProperty: 'success',
                messageProperty: 'message'
            },
            writer: {type: 'json'}
        }
    });

    storeClientes = Ext.create('Ext.data.Store', {
        model: 'modelCliente',
        pageSize: pageSize,
        id: 'idStoreClientes',
        sorters: [{property: 'id_cliente', direction: 'ASC'}]
    });
    return storeClientes;
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
            url: 'listartratamientos',
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
        autoLoad: true,
        sorters: [{property: 'id_tratamiento', direction: 'ASC'}],
    });
    return storeTratamientos;
}

obtenerStoreSesiones = function (pageSize) {
    Ext.define('modelSesiones', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id_sesion', type: 'int'},
            {name: 'id_cliente', type: 'int'},
            {name: 'id_tratamiento', type: 'int'},
            {name: 'comentario', type: 'string'},
            {name: 'fecha_alerta', type: 'string'},
            {name: 'fecha_creado', type: 'string'},
            {name: 'html', type: 'string'},
        ],
        proxy: {
            type: 'ajax',
            url: 'sesiones',
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

    storeSesiones = Ext.create('Ext.data.Store', {
        model: 'modelSesiones',
        pageSize: pageSize,
        id: 'idStoreSesiones',
        sorters: [{property: 'id_sesion', direction: 'ASC'}]
    });
    return storeTratamientos;
}

obtenerColumnasCliente = function () {
    return [
        Ext.create('Ext.grid.RowNumberer'),
        {
            text: 'Nombre',
            dataIndex: 'nombre',
            menuDisabled: true,
            sortable: false,
            flex: 1
        }, {
            text: 'Celular',
            dataIndex: 'celular',
            flex: 1,
            menuDisabled: true,
            sortable: false
        }, {
            text: 'Correo',
            dataIndex: 'correo',
            flex: 1,
            menuDisabled: true,
            sortable: false
        }, {
            text: 'Creado',
            dataIndex: 'fecha_creado',
            width: 120,
            align: 'center',
            renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            menuDisabled: true,
            sortable: false
        }, {
            xtype: 'checkcolumn',
            text: 'Alertas',
            menuDisabled: true,
            dataIndex: 'alertas',
            width: 70,
            listeners: {
                'beforecheckchange': function () {
                    return false;
                }
            }
        }, {
            text: 'Acciones',
            menuDisabled: true,
            align: 'center',
            sortable: false,
            xtype: 'actioncolumn',
            flex: 1,
            items: [{
                icon: '../Template/purple-vertical/assets/icons/editar.png',
                tooltip: 'Editar cliente',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    abrirVentana(record);
                }
            }, '-', {
                icon: '../Template/purple-vertical/assets/icons/textproduct.png',
                tooltip: 'Agregar Tratamiento',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    addTratamiento(record);
                }
            }, '-', {
                icon: '../Template/purple-vertical/assets/icons/tabs.gif',
                tooltip: 'Mostrar Sesiones por Tratamientos',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    addSesiones(record);
                }
            },'-', {
                icon: '../Template/purple-vertical/assets/icons/actualizar.png',
                tooltip: 'Mostrar Historial',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    addHistorial(record);
                }
            }, '-', {
                icon: '../Template/purple-vertical/assets/icons/eliminar.png',
                tooltip: 'Eliminar Cliente',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    Ext.MessageBox.confirm('Confirmaci&oacute;n', '¿Desea eliminar el elemento seleccionado?', function (btn) {
                        if (btn == 'yes') {
                            storeClientes.remove(record);
                            var myform = Ext.create('Ext.form.Panel', {
                                url: metodoCargarCliente,
                                items: [{
                                    xtype: 'numberfield',
                                    name: 'id_cliente',
                                    value: record.get('id_cliente')
                                }, {
                                    xtype: 'textfield',
                                    name: 'metodo',
                                    value: 'eliminar'
                                }]
                            });

                            myform.getForm().submit({
                                success: function (form, action) {
                                    var jsonDataResponse = action.result;
                                    $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                                    actualizarCliente();
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
        }]
};

abrirVentana = function (object) {
    var name = 'Agregar cliente';
    var icon = '../Template/purple-vertical/assets/icons/iconAddNew2.png';

    if (object != null) {
        name = 'Editar cliente';
        icon = '../Template/purple-vertical/assets/icons/eliminar.png';
    }

    var myform = Ext.create('Ext.form.Panel', {
        url: metodoCargarCliente,
        fileUpload: true,
        border: false,
        fieldDefaults: {
            labelAlign: 'top',
            anchor: '100%'
        },
        items: [{
            xtype: 'numberfield',
            name: 'id_cliente',
            hidden: true,
            value: object != null ? object.get('id_cliente') : null
        }, {
            xtype: 'textfield',
            name: 'metodo',
            hidden: true,
            value: object != null ? 'actualizar' : 'adicionar'
        }, {
            xtype: 'textfield',
            fieldLabel: 'Nombre del cliente',
            name: 'nombre',
            allowBlank: false,
            value: object != null ? object.get('nombre') : null
        }, {
            xtype: 'panel',
            layout: 'hbox',
            items: [{
                xtype: 'numberfield',
                fieldLabel: 'Tel&eacute;fono',
                width: 150,
                hideTrigger: true,
                name: 'celular',
                allowBlank: false,
                value: object != null ? object.get('celular') : null
            }, {
                xtype: 'checkbox',
                labelAlign: 'right',
                labelWidth: 110,
                margin: '40 0 0 0',
                fieldLabel: 'Alertas',
                name: 'alertas',
                checked: object != null ? object.get('alertas') : false,
            }]
        }, {
            xtype: 'textfield',
            fieldLabel: 'Correo',
            name: 'correo',
            value: object != null ? object.get('correo') : null
        }]
    });

    var wind = Ext.widget('window', {
        title: name,
        icon: icon,
        border: false,
        layout: 'form',
        width: 350,
        modal: true,
        resizable: false,
        closable: true,
        closeAction: 'close',
        bodyStyle: 'padding: 15px;',
        defaultType: 'textfield',
        items: [myform],
        bbar: ['->', {
            text: 'Cerrar',
            width: 100,
            handler: function () {
                wind.close();
            }
        }, {
            text: 'Guardar',
            width: 100,
            handler: function () {
                if (myform.isValid() && myform.isDirty()) {
                    myform.getForm().submit({
                        success: function (form, action) {
                            var jsonDataResponse = action.result;
                            $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                            actualizarCliente();
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

addTratamiento = function (object) {
    var cantImages = 0;

    var paneluploads = Ext.create('Ext.panel.Panel', {
        width: 350,
        height: 380,
        layout: 'anchor',
        border: false,
        padding: '0 10 10 10',
        margin: '-5 0 0 0',
        overflowY: 'auto',
        defaults: {
            anchor: '99%'
        },
        tbar: ['->', {
            xtype: 'button',
            tooltip: 'Adicionar imagen',
            icon: '../Template/purple-vertical/assets/icons/add.gif',
            style: 'background:transparent !important; border-color:transparent !important',
            handler: function () {
                paneluploads.add({
                    xtype: 'panel',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        tooltip: 'Eliminar imagen',
                        margin: '5 10 0 0',
                        style: 'background:transparent !important; border-color:transparent !important',
                        icon: '/Template/purple-vertical/assets/icons/eliminar.png',
                        handler: function (view, e) {
                            paneluploads.remove(this.up(), true);
                        }
                    }, {
                        xtype: 'fileuploadfield',
                        multiple: true,
                        width: 270,
                        name: 'imagen' + cantImages,
                        emptyText: 'Seleccionar imagen'
                    }]
                });
                cantImages++;
            }
        }],
        items: [{
            xtype: 'fileuploadfield',
            multiple: true,
            width: 60,
            name: 'imagen',
            emptyText: 'Seleccionar imagen'
        }],
        bbar: ['->', {
            text: 'Cerrar',
            width: 100,
            handler: function () {
                wind.close();
            }
        }, {
            text: '+ Sesi&oacute;n',
            width: 100,
            handler: function () {
                if (myform.isValid() && myform.isDirty()) {
                    myform.getForm().submit({
                        success: function (form, action) {
                            var jsonDataResponse = action.result;
                            $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                            myform.getForm().reset();
                            actualizarCliente();
                        },
                        failure: function (form, action) {
                            console.info(action);
                            var jsonDataResponse = action.result;
                            $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                        }
                    });
                }
            }
        }]
    });

    var myform = Ext.create('Ext.form.Panel', {
        url: 'addsession',
        width: 600,
        region: 'center',
        fileUpload: true,
        layout: 'column',
        border: true,
        fieldDefaults: {
            labelAlign: 'top',
            anchor: '100%'
        },
        items: [{
            border: 1,
            items: [{
                xtype: 'numberfield',
                name: 'id_cliente',
                hidden: true,
                value: object.get('id_cliente')
            }, {
                xtype: 'textfield',
                fieldLabel: 'Nombre del cliente',
                name: 'nombre',
                readOnly: true,
                value: object.get('nombre')
            }, {
                xtype: 'combo',
                fieldLabel: 'Tratamiento',
                name: 'id_tratamiento',
                store: storeTratamientos,
                editable: false,
                forceSelection: true,
                displayField: 'nombre',
                valueField: 'id_tratamiento',
                allowBlank: false,
                autoHeight: true,
                queryMode: 'local',
                listeners: {
                    'select': function (combo, records, eOpts) {
                        var item = records[0];
                        storeSesiones.getProxy().extraParams = {
                            id_cliente: object.get('id_cliente'),
                            id_tratamiento: item.get('id_tratamiento')
                        };
                        storeSesiones.load(function (records, operation, sucess) {
                            var items = wind.down('#accordion').items.items;
                            if (sucess) {
                                wind.down('#emptytext').hide();
                                wind.down('#accordion').show();
                                wind.down('#accordion').removeAll();
                                for (var i = 0; i < records.length; i++) {
                                    wind.down('#accordion').add({
                                        xtype: 'panel',
                                        height: 200,
                                        overflowY: 'auto',
                                        collapsible: 'true',
                                        collapsed: true,
                                        width: 100,
                                        title: 'Sesi&oacute;n ' + (i + 1) + ' (' + records[i].get('fecha_creado') + ')',
                                        items: [{
                                            xtype: 'panel',
                                            html: '<p><strong>Comentario:</strong> </br><div style="margin-left: 20px;margin-top: -20px;">' + records[i].get('comentario') + '</div></p>'
                                        }, {
                                            xtype: 'panel',
                                            html: records[i].get('html')
                                        }]
                                    });
                                }

                            }
                        });
                    }
                }
            }, {
                xtype: 'textarea',
                fieldLabel: 'Comentario',
                width: 205,
                allowBlank: false,
                name: 'comentario',
            }, {
                xtype: 'datefield',
                fieldLabel: 'Alerta de proxima sesión',
                name: 'fecha_alerta',
                format: 'd/m/Y',
                minValue: new Date(),
                value: new Date()
            }]
        }, {
            //columnWidth:0.5,
            border: 1,
            items: [paneluploads]
        }],
    });

    var wind = Ext.widget('window', {
        title: 'Agregar tratamientos',
        icon: '../Template/purple-vertical/assets/icons/textproduct.png',
        border: false,
        // layout: 'accordion',
        modal: true,
        resizable: false,
        closable: true,
        closeAction: 'close',
        bodyStyle: 'padding: 15px;',
        defaultType: 'textfield',
        items: [myform]
    }).show();
}

addSesiones = function (object) {

    var form = Ext.create('Ext.form.Panel', {
        url: 'addsession',
        width: 600,
        //height: 380,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        border: false,
        //bodyPadding: 10,
        fieldDefaults: {
            labelAlign: 'top',
            labelWidth: 100,
            labelStyle: 'font-weight:bold'
        },
        items: [{
            xtype: 'fieldcontainer',
            labelStyle: 'font-weight:bold;padding:0;',
            layout: 'hbox',
            defaultType: 'textfield',
            fieldDefaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'numberfield',
                name: 'id_cliente',
                hidden: true,
                value: object.get('id_cliente')
            }, {
                flex: 1,
                xtype: 'textfield',
                fieldLabel: 'Nombre del cliente',
                name: 'nombre',
                readOnly: true,
                value: object.get('nombre'),
                //margins: '0 0 0 5'
            }, {
                xtype: 'combo',
                margins: '0 0 0 20',
                fieldLabel: 'Tratamiento',
                name: 'id_tratamiento',
                store: storeTratamientos,
                editable: false,
                forceSelection: true,
                displayField: 'nombre',
                valueField: 'id_tratamiento',
                allowBlank: false,
                autoHeight: true,
                queryMode: 'local',
                listeners: {
                    'select': function (combo, records, eOpts) {
                        var item = records[0];
                        storeSesiones.getProxy().extraParams = {
                            id_cliente: object.get('id_cliente'),
                            id_tratamiento: item.get('id_tratamiento')
                        };
                        storeSesiones.load(function (records, operation, sucess) {
                            var items = wind.down('#accordion').items.items;
                            if (sucess) {
                                wind.down('#emptytext').hide();
                                wind.down('#accordion').show();
                                wind.down('#accordion').removeAll();
                                for (var i = 0; i < records.length; i++) {
                                    wind.down('#accordion').add({
                                        xtype: 'panel',
                                        height: 200,
                                        overflowY: 'auto',
                                        collapsed: false,
                                        width: 100,
                                        title: 'Sesi&oacute;n ' + (i + 1) + ' (' + records[i].get('fecha_creado') + ')',
                                        items: [{
                                            xtype: 'panel',
                                            html: '<p><strong>Comentario:</strong> </br><div style="margin-left: 20px;margin-top: -20px;">' + records[i].get('comentario') + '</div></p>'
                                        }, {
                                            xtype: 'panel',
                                            html: records[i].get('html')
                                        }]
                                    });
                                }

                            }
                        });
                    }
                }
            }]
        }]
    });

    var wind = Ext.widget('window', {
        title: 'Mostrar Sesiones por Tratamientos',
        icon: '../Template/purple-vertical/assets/icons/tabs.gif',
        border: false,
        height: 380,
        modal: true,
        resizable: false,
        closable: true,
        closeAction: 'close',
        bodyStyle: 'padding: 15px;',
        defaultType: 'textfield',
        items: [form, {
            xtype: 'panel',
            overflowY: 'auto',
            height: 450,
            width: 600,
            items: [{
                xtype: 'panel',
                margins: '10 0 0 0',
                itemId: 'emptytext',
                html: "Debe seleccionar un tratamiento"
            }, {
                xtype: 'panel',
                margins: '10 0 0 0',
                width: 600,
                itemId: 'accordion',
                height: 230,
                hidden: true,
                overflowY: 'auto',
                layout: {
                    type: 'fit',
                    animate: true
                }
            }]
        }]
    }).show()

}

addHistorial = function (object) {

    Ext.define('modelHistorial', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id_sesion', type: 'int'},
            {name: 'fecha_creado', type: 'string'},
            {name: 'nombre', type: 'string'},
            {name: 'comentario', type: 'string'},
            {name: 'imagen', type:'string'}
        ],
        proxy: {
            type: 'ajax',
            url: 'historial',
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total',
                idProperty: 'id_sesion',
                successProperty: 'success',
                messageProperty: 'message'
            },
            writer: {type: 'json'}
        }
    });

    storeHistorial = Ext.create('Ext.data.Store', {
        model: 'modelHistorial',
        pageSize: 25,
        id: 'idStoreHistorial',
        sorters: [{property: 'id_sesion', direction: 'ASC'}]
    });
    storeHistorial.getProxy().extraParams = {
        id_cliente: object.get('id_cliente')
    };
    storeHistorial.load();

    var listView = Ext.create('Ext.grid.Panel', {
        width:600,
        store: storeHistorial,
        columns: [{
            text: 'Fecha',
            format: 'd-m-Y',
            width: 120,
            dataIndex: 'fecha_creado'
        },{
            text: 'Nombre de Tratamiento',
            dataIndex: 'nombre',
            flex: 2
        },{
            text: 'Comentario',
            dataIndex: 'comentario',
            flex: 2
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
        }]
    });

    var wind = Ext.widget('window', {
        title: 'Mostrar Historial',
        icon: '../Template/purple-vertical/assets/icons/actualizar.png',
        border: false,
        height: 380,
        modal: true,
        resizable: false,
        closable: true,
        closeAction: 'close',
        bodyStyle: 'padding: 15px;',
        defaultType: 'textfield',
        items: [listView]
    }).show()

}

actualizarCliente = function () {
    storeClientes.load();
}

obtenerTablaCLientes = function () {
    return Ext.getCmp('gridClientes');
}

reconfigurarTabla = function (newValue) {
    Ext.destroy(Ext.getCmp('gridClientes'));
    Ext.getCmp('panelClientes').add(obtenerTablaClientes(newValue));
}

actualizarContenedorPadre = function (componente_DOM) {
    Ext.getCmp(componente_DOM.children[0].id).setWidth(componente_DOM.clientWidth - componente_DOM.offsetLeft);
}

