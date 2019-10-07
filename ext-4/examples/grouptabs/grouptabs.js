Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    // create some portlet tools using built in Ext tool ids
    var tools = [{
        type: 'gear',
        handler: function () {
            Ext.Msg.alert('Message', 'The Settings tool was clicked.');
        }
    }, {
        type: 'close',
        handler: function (e, target, panel) {
            panel.ownerCt.remove(panel, true);
        }
    }];

    Ext.create('Ext.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'grouptabpanel',
            activeGroup: 0,
            items: [{
                mainItem: 1,
            }, {
                expanded: true,
                
            }, {
                expanded: false,
                items: {
                    title: 'Single item in third',
                    bodyPadding: 10,
                    html: '<h1>The third tab group only has a single entry.<br>This is to test the tab being tagged with both "first" and "last" classes to ensure rounded corners are applied top and bottom</h1>',
                    border: false
                }
            }]
        }]
    });
});