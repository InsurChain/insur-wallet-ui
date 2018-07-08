const ipfsAPI = require('ipfs-api');
//const ipfs = ipfsAPI({host: 'ipfs.insurchain.io', port: '5001', protocol: 'http'});

const ipfs = ipfsAPI({host: '47.89.228.99', port: '5001', protocol: 'http'});
exports.addFile = (buffer) =>{
    return new Promise((resolve,reject)=>{
        try {
            ipfs.add(buffer, function (err, files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                } else {
                    resolve(files[0].hash);
                }
            })
        }catch(ex) {
            reject(ex);
        }
    })

 
}
exports.getFile = (hash) =>{
    return new Promise((resolve,reject)=>{
        try{
            ipfs.get(hash,function (err,files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                }else{
                    resolve(files[0].content);
                }
            })
        }catch (ex){
            reject(ex);
        }
    });
}