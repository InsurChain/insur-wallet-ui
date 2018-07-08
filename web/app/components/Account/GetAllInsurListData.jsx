import React from "react";
import Immutable from "immutable";
import Translate from "react-translate-component";
import BindToChainState from "../Utility/BindToChainState";
import ChainTypes from "../Utility/ChainTypes";
import PrivateKeyStore from "stores/PrivateKeyStore";
import WalletDb from "stores/WalletDb.js";
import WalletUnlockActions from "../../actions/WalletUnlockActions";
import {ChainStore, Aes,FetchChainObjects} from "graphenejs-lib/es";
const ipfsFile = require('../../api/ipfsFile');
const $ = require('jquery')
class GetAllInsurListData extends React.Component {
   
     static defaultProps = {
      // source:"https://witnode.insurchain.io/api/v1/getBillsList/"
         source:"http://witnode.insurchain.org/api/v1/getBillsList/"
    };
    constructor(props) {
        super(props);
        this.state = {
          ipfsHashListData: []
      };
    }
    //组件将要挂载
    omponentWillMount () {
    }
    //组件渲染完成,可以在这里调用ajax请求
    componentDidMount () {
    var source = this.props.source+this.props.account.name;
    this.serverRequest = $.get(source,function (data) {
        if(data.result =="success")
        {
          this.setState(
            {ipfsHashListData: data.data});
        }
        else{
         //alert(data.message)
        }
         }.bind(this));
    }
    componentWillUnmount () {
        //this.serverRequest.abort();
      }
    componentWillReceiveProps (nextProps) {
    }
    shouldComponentUpdate (nextProps,nextState) {
      
      var source = this.props.source+this.props.account.name;
      let _this=this;
      $.get(source,function (data) {
            if(data.result =="success")
            {
              _this.setState(
                {ipfsHashListData: data.data});
            }
            else{
            //alert(data.message)
            }
            });
        return true;
    }
    componentWillUpdate (nextProps,nextState) {
    }
    componentDidUpdate (prevProps,prevState) {
    }
    //下载文件
    downloadFileFunc(hashcode,file_format,file_name)
    {   
        WalletUnlockActions.unlock().then(() => {
        ipfsFile.getFile(hashcode).then((buff)=>{
          let public_key= this.props.account.owner.key_auths[0][0]
          var private_key = WalletDb.getPrivateKey(public_key).toWif();
          var aes = Aes.fromSeed(new Buffer(private_key.toString('hex')))
          var  plaintBuffer2= aes.decrypt(buff)
          const element = document.createElement('a');
          const file = new Blob([plaintBuffer2],{type:file_format});
          element.href = URL.createObjectURL(file);
          element.download = file_name;
          element.click();
        }).catch((err)=>{
            console.log(err);
        })
     })
  }
    
    render() {
       return (
        <div>
            <h3><Translate content="account.insurlistes.myInsur" /></h3>
            <table className="table" >
                 <thead>
                      <tr>
                          <th><Translate content="policy.file_name" /></th>
                          <th><Translate content="policy.policy_hash_code" /></th>
                          <th><Translate content="policy.policy_block_num" /></th>
                          {/* <th><Translate content="policy.transaction_Id" /></th> */}
                          <th><Translate content="policy.operation" /></th>
                      </tr>
                </thead>
              <tbody>
                {
                  this.state.ipfsHashListData.map((row,index)=>{
                    return (
                      <tr key={index}>
                      <td >{row.origin_name}</td>
                      <td >{row.bill_hash}</td>
                      <td >{row.block_num}</td>
                      {/* <td >{row.trx_id}</td> */}
                      <td >{
                      <button className={"button outline"} onClick={this.downloadFileFunc.bind(this, row.bill_hash,row.suffix,row.origin_name)}>
                        <Translate content="policy.file_download"/>
                    </button>}</td>
                      </tr>
                      )
                  }) 
                }
              </tbody>
            </table>
     </div>

    );
    }
}
GetAllInsurListData = BindToChainState(GetAllInsurListData);
export {GetAllInsurListData};
