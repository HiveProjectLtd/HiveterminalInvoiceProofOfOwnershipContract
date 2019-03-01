/**
 * @title Ownership
 * @dev The Ownership contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 *
 * Copyright © 2018 by Hive Project Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND (express or implied).
 */

pragma solidity 0.4.24;


contract Ownership {
    address public owner;
    address public newOwner;

    event OwnerUpdate(address _prevOwner, address _newOwner);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        assert(msg.sender == owner);
        _;
    }

    modifier onlyNewOwner {
        assert(msg.sender == newOwner);
        _;
    }

    /**
    * @dev Transfers ownership. New owner has to accept in order ownership change to take effect
    */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != owner, "The new owner is the same like the old one");
        newOwner = _newOwner;
    }

    /**
    * @dev Accepts transferred ownership
    */
    function acceptOwnership() public onlyNewOwner {
        emit OwnerUpdate(owner, newOwner);
        owner = newOwner;
        newOwner = 0x0;
    }
}
