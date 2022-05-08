pragma solidity ^0.8.0;

contract Contract {
    // 0x0000000000000000000000000000000000000000000000000000000000000000
    uint256 slot0;
    uint256 slot1;
    uint256 slot2;
    uint256 slot3;
    uint256 slot4;
    uint256 slot5;
    uint256 slot6;
    uint256 slot7;
    uint256 slot8;
    uint256 slot9;

    uint256 dump;

    constructor() {
        slot0 = 10;
        slot1 = 10;
        slot2 = 10;
        slot3 = 10;
        slot4 = 10;
        slot5 = 10;
        slot6 = 10;
        slot7 = 10;
        slot8 = 10;
        slot9 = 10;
    }

    function blob() public {
        uint256 a = slot0;
        a = slot1;
        a = slot2;
        a = slot3;
        a = slot4;
        a = slot5;
        a = slot6;
        a = slot7;
        a = slot8;
        a = slot9;

        dump = block.number;
    }
}