import {Apis} from "graphenejs-ws";

class Api {

    lookupAccounts(startChar, limit) {
        return Apis.instance().db_api().exec("lookup_accounts", [
            startChar, limit
        ]);
    }
    get_operations(block_num,trx_in_block) {
        return Apis.instance().db_api().exec("get_operations", [
            block_num, trx_in_block
        ]);
    }

}

export default new Api();
