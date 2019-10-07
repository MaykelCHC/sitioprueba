/**
 * Created by Yordan E. Estrada Rodriguez on 29/10/2018.
 */

abrirVentana = function (object) {

    var myform = Ext.widget('form', {
        xtype: "form",
        url: 'listarsolicitudes',
        fileUpload: true,
        border: false,
        fieldDefaults: {
            labelAlign: 'top',
            anchor: '100%'
        },
        items: [{
            layout: "column",
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'numberfield',
                    name: 'id_solicitud',
                    hidden: true,
                    value: object.id_solicitud
                }, {
                    xtype: 'numberfield',
                    name: 'estado',
                    hidden: true,
                    value: 2
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Nombre',
                    name: 'nombre',
                    readOnly: true,
                    value: object.nombre
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Fecha',
                    name: 'fecha',
                    readOnly: true,
                    value: object.fecha
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Correo',
                    name: 'correo',
                    readOnly: true,
                    value: object.correo
                }, {
                    xtype: 'button',
                    text: 'Dejar de notificar',
                    width: 150,
                    hidden: !object.notification_button,
                    margin: '30 0 0 40',
                    handler: function () {
                        Ext.Ajax.request({
                            url: 'detenernotificacion',
                            params: {
                                'id_solicitud': object.id_solicitud
                            },
                            success: function (response) {
                                wind.close();
                                location.reload();
                            },
                        });
                    }
                }]
            }, {
                columnWidth: 0.5,
                margin: '0 0 0 20',//(top, right, bottom, left).,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Tel&eacute;fono',
                    name: 'telefono',
                    readOnly: true,
                    value: object.telefono
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Hora',
                    name: 'hora',
                    readOnly: true,
                    value: object.hora
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'Mensaje',
                    name: 'mensaje',
                    readOnly: true,
                    value: object.mensaje
                }]
            }]
        }]
    });
    var wind = Ext.widget('window', {
        title: 'Detalles de la consulta',
        icon: '../Template/purple-vertical/assets/icons/information.png',
        border: false,
        layout: 'hbox',
        //width:350,
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
            text: 'Eliminar',
            width: 100,
            handler: function () {
                myform.getForm().submit({
                    success: function (form, action) {
                        var jsonDataResponse = action.result;
                        $.Notification.notify('success', 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                        $('#calendar').fullCalendar('removeEvents', object.eventId);
                    },
                    failure: function (form, action) {
                        var jsonDataResponse = action.result;
                        $.Notification.notify('success', 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                    }
                });
                wind.close();
            }
        }]
    }).show();
}

proconsultaVentana = function () {

    var myform = Ext.widget('form', {
        xtype: "form",
        url: 'recibirsolicitud',
        fileUpload: true,
        border: false,
        fieldDefaults: {
            labelAlign: 'top',
            anchor: '100%'
        },
        items: [{
            layout: "column",
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Nombre',
                    name: 'nombre'
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Fecha',
                    name: 'fecha',
                    format: 'Y/m/d',
                    value: new Date()  // defaults to today
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Correo',
                    name: 'correo'
                }]
            }, {
                columnWidth: 0.5,
                margin: '0 0 0 20',//(top, right, bottom, left).,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Tel&eacute;fono',
                    name: 'telefono'
                }, {
                    xtype: 'timefield',
                    name: 'hora',
                    fieldLabel: 'Hora',
                    minValue: '7:00 AM',
                    maxValue: '12:00 PM',
                    increment: 30
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'Mensaje',
                    name: 'mensaje'
                }]
            }]
        }]
    });

    var wind = Ext.widget('window', {
        title: 'Programar la Consulta',
        icon: '../Template/purple-vertical/assets/icons/information.png',
        border: false,
        layout: 'hbox',
        //width:350,
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
            text: 'Programar',
            width: 100,
            handler: function () {
                myform.getForm().submit({
                    success: function (form, action) {
                        var jsonDataResponse = action.result;
                        location.reload();
                        $.Notification.notify('success', 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);

                    },
                    failure: function (form, action) {
                        var jsonDataResponse = action.result;
                        $.Notification.notify('success', 'top left', jsonDataResponse.titleMsg, jsonDataResponse.msg);
                    }
                });
                wind.close();
            }
        }]
    }).show();
}

actualizarContenedorPadre = function (componente_DOM) {
    Ext.getCmp(componente_DOM.children[0].id).setWidth(componente_DOM.clientWidth - componente_DOM.offsetLeft);
}
