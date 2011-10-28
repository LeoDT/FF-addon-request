var JetWidget = require("widget");
var JetData = require("self").data;
var JetPanel = require("panel");

exports.main = function(options, callbacks){
    var panel = JetPanel.Panel({
        id: "panel",
        contentURL: JetData.url("popup.html"),
        contentScriptFile: [
            JetData.url("script/request.js")
        ],
        contentScriptWhen: "end"
    }),
    
    icon = JetWidget.Widget({
        id: "icon",
        label: "icon",
        contentURL: JetData.url("icon.png"),
        panel: panel
    });
    
    panel.port.on("req", function(data){
        switch(data.type){
            case "get":
            case "post":
                processRequest(data, function(res){
                    if(res.status == 200 || res.status == 304){
                        panel.port.emit("res", {
                            success: true,
                            data: res.json,
                            id: data.id
                        });
                    }
                    else{
                        panel.port.emit("res", {
                            success: false,
                            data: res.json,
                            id: data.id
                        });
                    }
                });
        }
    });
    
    function processRequest(data, callback){
        var Request = require('request').Request;
        if(data.type == "get"){
            Request({
                url: data.url,
                onComplete: function (res) {
                    callback({
                        status: res.status,
                        json: JSON.parse(res.text)
                    });
                }
            }).get();
        }
        else{
            Request({
                url: data.url,
                content: encodeURIComponent(data.data),
                headers: data.headers,
                onComplete: function (res) {
                    callback({
                        status: res.status,
                        json: JSON.parse(res.text)
                    });
                }
            }).post();
        }
    }
};