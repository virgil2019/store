// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Store {
    struct Order {
        uint256 orderId;
        string data;
        string arTx;
        string status;
    }

    constructor() public {

    }

    mapping(uint256 => Order) public idToOrder;
    uint256 public orderIds ;

    function saveOrder(string memory data) public {
        orderIds = orderIds + 1;
        idToOrder[orderIds] = Order(
            orderIds,
            data,
            "",
            "created"
        );
    }

    function getOrder(uint256 orderId) public view returns (Order memory){
         Order memory order = idToOrder[orderId];
         return order;
    }

    function updateOrderArTx(uint256 orderId, string memory arTx) public{
        Order storage order = idToOrder[orderId];
        order.arTx = arTx;
    } 
}