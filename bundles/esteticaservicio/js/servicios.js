/**
 * Created by Maykel on 16/10/2018.
 */

//Variables para llevar cantidad a mostrar en la web
var maxInWeb = 7;
var currentInWeb = 0;

var storeServicios = '';
var storeCategoria = '';

var metodoCargarCategoria = 'cargarcategoria';
var metodoCargarServicio = 'listarservicios';
var limites = Ext.create('Ext.data.Store', {
    fields: ['limit'],
    data: [{"limit": 10}, {"limit": 25}, {"limit": 50}, {"limit": 100}]
});

actualizarContenedorPadre = function (componente_DOM) {
    Ext.getCmp(componente_DOM.children[0].id).setWidth( componente_DOM.clientWidth - componente_DOM.offsetLeft);
}

Ext.onReady(function () {

    Ext.QuickTips.init();
    obtenerStoreCategoria();

    Ext.create('Ext.panel.Panel', {
        renderTo: 'weservicio',
        id: 'panelServicios',
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
                    tooltip: 'Adiciona un servicio',
                    icon: '../Template/purple-vertical/assets/icons/iconAddNew2.png',
                    id: 'id-btn-AdicionarServicio',
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
        items: [obtenerTablaServicios(limites.getAt(0).get('limit'))],
        listeners: {
            add: function (vtn, component, index, eOpts) {
                component.getStore().load();
            }
        }
    });
});

obtenerTablaServicios = function (newValue) {

    var grid = Ext.create('Ext.grid.Panel', {
        id: 'gridServicios',
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
        store: obtenerStoreServicio(newValue),
        columns: obtenerColumnasServicio(),
        bbar: Ext.create('Ext.PagingToolbar', {
            store: storeServicios,
            displayInfo: true
        })
    });
    return grid;
}

obtenerStoreServicio = function (pageSize) {
    Ext.define('modelServicio', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id_servicio', type: 'int'},
            {name: 'nom_servicio'},
            {name: 'id_categoria', type:'int'},
            {name: 'nombre'},
            {name: 'precio', type: 'int'},
            {name: 'descripcion'},
            {name: 'imagen', type:'fileuploadfield'},
            {name: 'website', type: 'bool'},
        ],
        proxy: {
            type: 'ajax',
            url: metodoCargarServicio,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total',
                idProperty: 'id_servicio',
                successProperty: 'success',
                messageProperty: 'message'
            },
            writer: {type: 'json'}
        }
    });

    storeServicios = Ext.create('Ext.data.Store', {
        model: 'modelServicio',
        pageSize: pageSize,
        id: 'idStoreServicios',
        sorters: [{property: 'id_servicio', direction: 'ASC'}],
        listeners:{
            load:function(view, records, successful, eOpts ){
                currentInWeb= view.proxy.reader.jsonData.inweb;
            }
        }
    });
    return storeServicios;
}

obtenerStoreCategoria = function (pageSize) {
    Ext.define('modelCategoria', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id_categoria', type: 'int'},
            {name: 'nombre'}
        ],
        proxy: {
            type: 'ajax',
            url: metodoCargarCategoria,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total',
                idProperty: 'id_categoria',
                successProperty: 'success',
                messageProperty: 'message'
            },
            writer: {type: 'json'},
            listeners : {
                exception : function ( reader, response, error, eOpts ) {
                    var textoRespuesta = Ext.decode(response.responseText);
                    $.Notification.notify( 'error', 'top left', textoRespuesta.titleMsg, textoRespuesta.msg );
                }
            }
        }
    });

    storeCategoria = Ext.create('Ext.data.Store', {
        model: 'modelCategoria',
        pageSize: pageSize,
        autoLoad:true,
        id: 'idStoreCategoria',
        sorters: [{property: 'id_categoria', direction: 'ASC'}]
    });
    return storeCategoria;
}

obtenerColumnasServicio = function () {
    return [
        Ext.create('Ext.grid.RowNumberer'),
        {
            text        : 'Servicio',
            dataIndex   : 'nom_servicio',
            menuDisabled: true,
            sortable    : false,
            flex        : 1,
        }, {
            text        : 'Categor&iacute;a',
            dataIndex   : 'nombre',
            flex        : 1,
            menuDisabled: true,
            sortable    : false,
        }, {
            text        : 'Precio',
            dataIndex   : 'precio',
            flex        : 1,
            menuDisabled: true,
            sortable    : false,
        }, {
            text        : 'Descripci&oacute;n',
            dataIndex   : 'descripcion',
            flex        : 1,
            align       : 'center',
            menuDisabled: true,
            sortable    : false,
        },{
            text        : 'Imagen',
            dataIndex   : 'imagen',
            align:"center",
            flex        : 1,
            menuDisabled: true,
            sortable    : false,
            renderer: function(value, meta, rec){
                return '<img src="../public/images/services/'+rec.get('imagen')+'" height="30px"/>';
            }
        },{
            xtype       : 'checkcolumn',
            text        : 'Website',
            menuDisabled: true,
            dataIndex   : 'website',
            flex        : 1,
            listeners:{
                'beforecheckchange': function(){
                    return false;
                }
            },
        }, {
            text        : 'Acciones',
            menuDisabled: true,
            align       : 'center',
            sortable    : false,
            xtype       : 'actioncolumn',
            flex        : 1,
            items: [{
                icon   : '../Template/purple-vertical/assets/icons/editar.png',
                tooltip: 'Editar Servicio',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    abrirVentana(record);
                }
            },'->',{
                icon   : '../Template/purple-vertical/assets/icons/eliminar.png',
                tooltip: 'Eliminar Servicio',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    Ext.MessageBox.confirm('Confirmaci&oacute;n', '¿Desea eliminar el elemento seleccionado?',  function (btn) {
                        if (btn == 'yes') {
                                storeServicios.remove(record);
                                var myform = Ext.create('Ext.form.Panel',{
                                    url: metodoCargarServicio,
                                    items:[{
                                        xtype:'numberfield',
                                        name:'id_servicio',
                                        value:record.get('id_servicio')
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
                                        actualizarServicio();
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
    var name = 'Agregar servicio';
    var icon = '../Template/purple-vertical/assets/icons/iconAddNew2.png';
    var categoria = null;
    var deshabilitado = true;

    if(currentInWeb < maxInWeb)
        deshabilitado = false;

    if(object != null){
        name= 'Editar servicio';
        icon = '../Template/purple-vertical/assets/icons/eliminar.png';
        categoria = storeCategoria.findRecord( 'id_categoria', object.get('id_categoria'), 0, false, false, true ).get('nombre');

        if(object.get('website'))
            deshabilitado = false;
    }

    var myform = Ext.create('Ext.form.Panel',{
        url: metodoCargarServicio,
        fileUpload: true,
        border:false,
        fieldDefaults: {
            labelAlign: 'top',
            anchor: '100%'
        },
        items:[{
            xtype:'numberfield',
            name:'id_servicio',
            hidden:true,
            value:object!= null? object.get('id_servicio'):null
        },{
            xtype:'textfield',
            name:'metodo',
            hidden:true,
            value:object!= null? 'actualizar':'adicionar'
        },{
            xtype:'textfield',
            fieldLabel: 'Nombre del servicio',
            name:'nom_servicio',
            allowBlank: false,
            value:object!= null? object.get('nom_servicio'):null
        },{
            xtype:'combo',
            fieldLabel: 'Categor&iacute;a',
            name: 'categoria',
            store:storeCategoria,
            displayField: 'nombre',
            valueField: 'nombre',
            allowBlank: false,
            value:categoria,
            autoHeight: true,
            queryMode: 'local'
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
            xtype:'textarea',
            fieldLabel: 'Descripci&oacute;n',
            name:'descripcion',
            value:object!= null? object.get('nom_servicio'):null
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
                            actualizarServicio();
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

actualizarServicio = function () {
    storeServicios.load();
    storeCategoria.load();
}

reconfigurarTabla = function (newValue) {
    Ext.destroy(Ext.getCmp('gridServicios'));
    Ext.getCmp('panelServicios').add(obtenerTablaServicios(newValue));
}

