import React from "react";
import Immutable from "immutable";
import Translate from "react-translate-component";
import WalletDb from "stores/WalletDb.js";
import {Aes} from "graphenejs-lib/es";
import utils from "common/utils";
import HelpContent from "../Utility/HelpContent";
import BindToChainState from "../Utility/BindToChainState";
import ChainTypes from "../Utility/ChainTypes";
import {PrivateKey} from "graphenejs-lib/es";
import {PublicKey} from "graphenejs-lib/es";
import PrivateKeyStore from "stores/PrivateKeyStore";
import {Link} from "react-router/es";
import AccountActions from "actions/AccountActions";
import WalletUnlockActions from "../../actions/WalletUnlockActions";
import TransactionConfirmActions from "actions/TransactionConfirmActions";
import TransactionConfirmStore from "stores/TransactionConfirmStore";
import { connect } from "alt-react";
import { GetAllInsurListData } from "./GetAllInsurListData";

const ipfsFile = require('../../api/ipfsFile');
const $ = require('jquery')
let file_name,file_size,file_type,policy_hash_code,trx_id="";
class AccountInsurList extends React.Component {
    static propTypes = {
      account: ChainTypes.ChainAccount.isRequired
     };
     constructor(props) {
        super(props);
        console.log(this.props)  
        this.state = {
            transaction_id: ""
        };
    }
     shouldComponentUpdate(nextProps) {
        if (!nextProps.transaction) {
            return false;
        }

        if(nextProps.trx_id!=null && nextProps.trx_id!=trx_id)
        {
            let account = this.props.account.toJS();
            // var source ="https://witnode.insurchain.io/api/v1/insurBill";
            var source ="http://witnode.insurchain.org/api/v1/insurBill";
            var ipfsdata={};
            ipfsdata.txr_id = nextProps.trx_id;
            trx_id = nextProps.trx_id;
            ipfsdata.block_num = nextProps.trx_block_num.toString();
            ipfsdata.origin_name= file_name;
            ipfsdata.suffix = file_type;
            ipfsdata.size = file_size;
            ipfsdata.bill_hash = policy_hash_code;
            ipfsdata.user_id = account.id;
            ipfsdata.nick_name = account.name;
            let _this=this;
            $.ajax({
                type: 'POST',
                url: source,
                data: JSON.stringify(ipfsdata),
                success: function(result)
                {
                    console.log(result)
                    if(result.result=="false" && result.msg=="repeat bill")
                    {
                        alert("the file has already uploaded!")
                    } 
                    else if(result.result=="success")
                    {
                        _this.setState({transaction_id: trx_id}); 
                    } 
                    else
                    {
                        
                    }    
                },
                headers:{"Content-Type":"application/json;charset=UTF-8"},
                });    
        }
        return (
            !utils.are_equal_shallow(nextProps, this.props)    
        );
    }
   
    onUploadFile(account)
    {
        let fileDom = document.getElementById("upload_input_file");
        let file;
    
        if(fileDom.files.length<1)
            alert("请选择文件");
        else
        {
            let file = fileDom.files[0];
            file_name = file.name;
            file_type = file.type;
            file_size = file.size;

            if( typeof FileReader == "undefined" ){ 
                alert( "您的浏览器不支持FileReader！" );  
            }
            else
            { 
                WalletUnlockActions.unlock().then(() => {
                let public_key= account.owner.key_auths[0][0]
                var private_key = WalletDb.getPrivateKey(public_key).toWif();
                var aes = Aes.fromSeed(new Buffer(private_key.toString('hex')));
                  // do FileReader 
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onloadend= function()
                {
                    var plaintArray = reader.result; 
                    var plaintBuffer =   Buffer.from(plaintArray);
                    var encryptBuffer = aes.encrypt(plaintBuffer);
                      //ipfs
                    ipfsFile.addFile(encryptBuffer).then((hash_code)=>
                    {
                        policy_hash_code = hash_code;
                        //console.log(hash_code);
                        //AccountActions.policy(account.id,file_name,file_type,file_size,hash_code);
                        AccountActions.upgradeAccount(account.id,false,true,hash_code);
                    })
                };
              })
 
            }
        }      
    }
   
    
    render() {
        let account = this.props.account.toJS();
        return (
            <div className="grid-content">
                <h3> <Translate content="account.insurList"/></h3>
                <Translate style={{textAlign: "left", maxWidth: "30rem"}} component="p"content="account.insurlistes.insurtext" />

                <div className="content-block">
                    <div>
                         <input ref="file_input" type="file" id="upload_input_file" style={{ border: "solid" }}/>  
                    </div>
                    <div className="button-group" style={{paddingTop: 20}}>
                        <button className={"button outline"} onClick={this.onUploadFile.bind(this, account)}>
                            <Translate content="account.insurlistes.upload"/>
                        </button>
                        
                    </div>
                    <GetAllInsurListData
                        account= {account} trx_id={this.state.transaction_id}
                    /> 
                </div>       
           </div>
           
        );
    }
}
AccountInsurList = connect(AccountInsurList, {
    listenTo() {
        return [TransactionConfirmStore];
    },
    getProps() {
        return TransactionConfirmStore.getState();
    }
});
export default BindToChainState(AccountInsurList);
