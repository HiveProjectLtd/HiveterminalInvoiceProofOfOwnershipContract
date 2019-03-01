/**
 * Hiveterminal Invoice Ownership Proof
 *
 * Copyright © 2019 by Hive Project Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND (express or implied).
*/

pragma solidity 0.4.24;

import "../helpers/Ownership.sol";

contract HiveterminalInvoiceOwnershipProof is Ownership {
    string public name = "Hiveterminal Invoice Ownership Proof";
    string public version = "0.1";
    mapping(bytes32 => string) private invoicesProof;

    event AddInvoiceProof(bytes32 indexed txHash, string data);

    function add(bytes32 txHash, string data) public onlyOwner {
        require(bytes(data).length != 0, "Empty data");
        require(bytes(invoicesProof[txHash]).length == 0, "Exists txHash");
        invoicesProof[txHash] = data;
        emit AddInvoiceProof(txHash, data);
    }
    
    function read(bytes32 txHash) public view returns(string data) {
        return invoicesProof[txHash];
    }
}