const HiveterminalInvoiceOwnershipProof = artifacts.require("./HiveterminalInvoiceOwnershipProof.sol");

module.exports = function(deployer) {
    deployer.deploy(HiveterminalInvoiceOwnershipProof);
};
