(function(){
    mknote.requestBuf = {};
    mknote.get = function(req){
        var id = guid();
        
        mknote.requestBuf[id] = req;
        self.port.emit("req", {
            type: "get",
            url: req.url,
            id: id
        });
    };

    mknote.post = function(req){
        var id = guid();
        
        mknote.requestBuf[id] = req;
        self.port.emit("req", {
            type: "post",
            url: req.url,
            data: req.data,
            headers: req.headers,
            id: id
        });
    };

    self.port.on("res", function(res){
        var data = res.data,
        request = mknote.requestBuf[res.id];
        
        if(res.success){
            request.success(data);
        }
        else{
            request.error(data);
        }
    });

    // Generate four random hex digits.
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
       return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
})();
