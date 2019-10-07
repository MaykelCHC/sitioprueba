/**
 * Created by Maykel on 16/10/2018.
 */

var maxInWeb              = 4;
var currentInWeb          = 0;

var storePromocion        = '';
var metodoCargarPromocion = 'listarpromociones';
var limites               = Ext.create('Ext.data.Store', {
    fields : ['limit'],
    data   : [{"limit" : 10}, {"limit" : 25}, {"limit" : 50}, {"limit" : 100}]
});

actualizarContenedorPadre = function (componente_DOM) {
    Ext.getCmp(componente_DOM.children[0].id).setWidth( componente_DOM.clientWidth - componente_DOM.offsetLeft);
};

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.panel.Panel', {
        renderTo    : 'jpromocion',
        id          : 'panelPromocion',
        layout      : 'fit',
        border      : false,
        bodyStyle: {
            border  : 0,
            padding : '10px'
        },
        dockedItems : [{
            xtype : 'toolbar',
            id    : 'toolBarGestionNivelActividad',
            dock  : 'top',
            items : [
                Ext.create('Ext.Button', {
                    text    : 'Agregar',
                    tooltip : 'Adiciona un promocion',
                    icon    : '../Template/purple-vertical/assets/icons/iconAddNew2.png',
                    id      : 'id-btn-AdicionarPromocion',
                    handler : function () { abrirVentana(null); }
                }), '->',
                Ext.create('Ext.form.ComboBox', {
                    fieldLabel   : 'Ver',
                    labelWidth   : 30,
                    width        : 100,
                    store        : limites,
                    queryMode    : 'local',
                    displayField : 'limit',
                    valueField   : 'limit',
                    value        : 10,
                    listeners    : {
                        change : function ( combo, newValue, oldValue, eOpts ) {
                            reconfigurarTabla(newValue);
                        }
                    }
                })
            ]
        }],
        items : [ obtenerTablaPromocion(limites.getAt(0).get('limit')) ],
        listeners : {
            add : function (vtn, component, index, eOpts) {
                component.getStore().load();
            }
        }
    });
});

obtenerTablaPromocion     = function (newValue) {
    return Ext.create('Ext.grid.Panel', {
        id          : 'gridPromocion',
        extend      : 'Ext.grid.Panel',
        requires    : 'Ext.ux.grid.FiltersFeature',
        multiSelect : false,
        border      : true,
        style       : { borderColor : '#ec5598', borderStyle : 'solid' },
        height      : 350,
        columnLines : true,
        viewConfig  : {stripeRows : true},
        resizable   : false,
        defaults    : {autoScroll : true, align : 'center'},
        store       : obtenerStorePromocion(newValue),
        columns     : obtenerColumnasPromocion(),
        bbar        : Ext.create('Ext.PagingToolbar', {
            store       : storePromocion,
            displayInfo : true
        })
    });
};

obtenerStorePromocion     = function (pageSize) {
    Ext.define('modelPromocion', {
        extend : 'Ext.data.Model',
        fields : [
            {name : 'id_promocion', type : 'int'},
            {name : 'nombre'},
            {name : 'precio',       type : 'float'},
            {name : 'imagen',       type : 'fileuploadfield'},
            {name : 'website',      type : 'bool'},
        ],
        proxy  : {
            type   : 'ajax',
            url    : metodoCargarPromocion,
            reader : {
                type            : 'json',
                root            : 'data',
                totalProperty   : 'total',
                idProperty      : 'id_promocion',
                successProperty : 'success',
                messageProperty : 'message'
            },
            writer : {type: 'json'}
        }
    });
    storePromocion = Ext.create('Ext.data.Store', {
        model     : 'modelPromocion',
        pageSize  : pageSize,
        id        : 'idStorePromocion',
        sorters   : [{property: 'id_promocion', direction: 'ASC'}],
        listeners : {
            load : function(view, records, successful, eOpts ){
                currentInWeb= view.proxy.reader.jsonData.inweb;
            }
        }
    });
    return storePromocion;
};

obtenerColumnasPromocion  = function () {
    return [
        Ext.create('Ext.grid.RowNumberer'),
        {
            text         : 'Nombre',
            dataIndex    : 'nombre',
            menuDisabled : true,
            sortable     : false,
            flex         : 1
        }, {
            text         : 'Precio',
            dataIndex    : 'precio',
            flex         : 1,
            menuDisabled : true,
            sortable     : false
        }, {
            text        : 'Imagen',
            dataIndex   : 'imagen',
            align:"center",
            flex        : 1,
            menuDisabled: true,
            sortable    : false,
            renderer: function(value, meta, rec){
                return '<img src="../public/images/promocion/'+rec.get('imagen')+'" height="30px"/>';
            }
        }, {
            xtype        : 'checkcolumn',
            text         : 'Website',
            menuDisabled : true,
            dataIndex    : 'website',
            flex         : 1,
            listeners    : {
                'beforecheckchange' : function(){
                    return false;
                }
            },
        }, {
            text         : 'Acciones',
            menuDisabled : true,
            align        : 'center',
            sortable     : false,
            xtype        : 'actioncolumn',
            flex         : 1,
            items        : [{
                icon   : '../Template/purple-vertical/assets/icons/editar.png',
                tooltip: 'Editar',
                handler: function (grid, rowIndex, colIndex, item, e, record) {
                    abrirVentana(record);
                }
            }, '->', {
                icon    : '../Template/purple-vertical/assets/icons/eliminar.png',
                tooltip : 'Eliminar',
                handler : function (grid, rowIndex, colIndex, item, e, record) {
                    Ext.MessageBox.confirm('Confirmaci&oacute;n', '¿Desea eliminar el elemento seleccionado?',  function (btn) {
                        if (btn == 'yes') {
                            storePromocion.remove(record);
                            var myform = Ext.create('Ext.form.Panel',{
                                url   : metodoCargarPromocion,
                                items : [{
                                    xtype : 'numberfield',
                                    name  : 'id_promocion',
                                    value : record.get('id_promocion')
                                },{
                                    xtype : 'textfield',
                                    name  : 'metodo',
                                    value : 'eliminar'
                                }]
                            });

                            myform.getForm().submit({
                                success: function (form, action) {
                                    var jsonDataResponse = action.result;
                                    $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                                    actualizarPromocion();
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
};

abrirVentana              = function(object){
    var name          = 'Agregar promoci&oacute;n';
    var icon          = '../Template/purple-vertical/assets/icons/iconAddNew2.png';
    var deshabilitado = true;

    if(currentInWeb < maxInWeb)
        deshabilitado = false;

    if(object != null){
        name= 'Editar promoci&oacute;n';
        icon = '../Template/purple-vertical/assets/icons/eliminar.png';

        if(object.get('website'))
            deshabilitado = false;
    }

    var myform = Ext.create('Ext.form.Panel',{
        url           : metodoCargarPromocion,
        fileUpload    : true,
        border        :false,
        fieldDefaults : {
            labelAlign : 'top',
            anchor     : '100%'
        },
        items         :[{
            xtype  : 'numberfield',
            name   : 'id_promocion',
            hidden : true,
            value  : object != null ? object.get('id_promocion') : null
        },{
            xtype  : 'textfield',
            name   : 'metodo',
            hidden : true,
            value  : object != null ? 'actualizar' : 'adicionar'
        },{
            xtype      : 'textfield',
            fieldLabel : 'Nombre de la promoci&oacute;n',
            name       : 'nombre',
            allowBlank : false,
            value      : object != null ? object.get('nombre') : null
        },{
            xtype  :'panel',
            layout :'hbox',
            items  :[{
                xtype            : 'numberfield',
                fieldLabel       : 'Precio',
                hideTrigger      : true,
                width            : 100,
                allowBlank       : false,
                name             : 'precio',
                decimalSeparator : '.',
                value            : object != null ? object.get('precio') : null
            },{
                xtype      : 'checkbox',
                labelAlign : 'right',
                labelWidth : 110,
                margin     : '40 0 0 60',
                fieldLabel : 'Ver en la Web',
                name       : 'website',
                checked    : object != null ? object.get('website') : false,
                readOnly   : deshabilitado
            }]
        },{
            xtype      : 'fileuploadfield',
            allowBlank : false,
            name       : 'imagen',
            fieldLabel : 'Imagen',
            rawValue   : object != null ? object.get('imagen') : null,
            emptyText  : 'Seleccionar imagen'
        }]
    });

    var wind = Ext.widget('window', {
        title       : name,
        icon        : icon,
        border      : false,
        layout      : 'form',
        width       : 350,
        modal       : true,
        resizable   : false,
        closable    : true,
        closeAction : 'close',
        bodyStyle   : 'padding: 15px;',
        defaultType : 'textfield',
        items       : [myform],
        bbar        : ['->',{
            text    : 'Cerrar',
            width   : 100,
            handler : function(){
                wind.close();
            }
        },{
            text    : 'Guardar',
            width   : 100,
            handler : function() {
                if (myform.isValid() && myform.isDirty()) {
                    myform.getForm().submit({
                        success : function (form, action) {
                            var jsonDataResponse = action.result;
                            $.Notification.notify(jsonDataResponse.img, 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                            actualizarPromocion();
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

actualizarPromocion       = function () { storePromocion.load(); };

reconfigurarTabla         = function (newValue) {
    Ext.destroy( Ext.getCmp('gridPromocion') );
    Ext.getCmp('panelPromocion').add(obtenerTablaPromocion(newValue));
};