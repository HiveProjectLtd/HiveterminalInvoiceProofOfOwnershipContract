const InvoiceOwnershipProof = artifacts.require("./HiveterminalInvoiceOwnershipProof.sol");

const expectThrow = async (promise) => {
    try {
        await promise;
    } catch (error) {
        const invalidJump = error.message.search('invalid JUMP') >= 0;
        const invalidOpcode = error.message.search('invalid opcode') >= 0;
        const outOfGas = error.message.search('out of gas') >= 0;
        const revert = error.message.search('revert') >= 0;
        const authentication = error.message.search('authentication') >= 0;

        assert(invalidJump || invalidOpcode || outOfGas || revert || authentication, "Expected throw, got '" + error + "' instead");
        return;
    }

    assert.fail('Expected throw not received');
};

contract("HiveterminalInvoiceOwnershipProof", async (accounts) => {
    let invoiceProofContract,
        owner,
        user,
        bytesData1 = "0x72cd40e0698e963eb3d46a18cba3c0f5b17c2de433612d8161b6ce2bfaef4a19",
        bytesData2 = "0x72cd40e0698e963eb3d46a18cba3c0f5b17c2de433612d8161b6ce2bfaef4a20",
        bytesData3 = "0x72cd40e0698e963eb3d46a18cba3c0f5b17c2de433612d8161b6ce2bfaef4a21",
        stringData1 = "test1",
        stringData2 = "test2",
        stringData3 = "test3";

    beforeEach(async () => {
        owner = accounts[0];
        user = accounts[1];
        invoiceProofContract = await InvoiceOwnershipProof.new();
    });

    before(async () => {
        const contract = await InvoiceOwnershipProof.new();
        const name = await contract.name();
        const version = await contract.version();
        let contractInfo = "  " + "-".repeat(40);
        contractInfo += "\n  " + "Current date is: " + new Date().toLocaleString("en-US", {timeZone: "UTC"});
        contractInfo += "\n  " + "-".repeat(40);
        contractInfo += "\n  Name: " + name;
        contractInfo += "\n  Version: " + version;
        contractInfo += "\n  " + "=".repeat(40);
        console.log(contractInfo);
    })

    describe("Invoices Proof", () => {
        it("should add invoice proof", async () => {
            const invoiceProof = await invoiceProofContract.add(bytesData1, stringData1, { from: owner });
            const events = invoiceProof.logs;

            assert.isArray(events, 'Events is not array!');
            assert.lengthOf(events, 1, 'The Events array has length of 1!');

            const event = events[0];
            assert.equal(event.event, "AddInvoiceProof", "Expected AddInvoiceProof event");
            assert.equal(event.args.txHash, bytesData1, "Expected txHash is " + bytesData1);
            assert.equal(event.args.data, stringData1, "Expected data is " + stringData1);
        });

        it("should add 3 invoice proofs", async () => {
            const invoiceProof = await invoiceProofContract.add(bytesData1, stringData1, { from: owner });
            const events = invoiceProof.logs;
            assert.isArray(events, 'Events is not array!');
            assert.lengthOf(events, 1, 'The Events array has length of 1!');

            const event = events[0];
            assert.equal(event.event, "AddInvoiceProof", "Expected AddInvoiceProof event");
            assert.equal(event.args.txHash, bytesData1, "Expected txHash is " + bytesData1);
            assert.equal(event.args.data, stringData1, "Expected data is " + stringData1);

            const invoiceProof2 = await invoiceProofContract.add(bytesData2, stringData2, { from: owner });
            const events2 = invoiceProof2.logs;
            assert.isArray(events2, 'Events is not array!');
            assert.lengthOf(events2, 1, 'The Events array has length of 1!');

            const event2 = events2[0];
            assert.equal(event2.event, "AddInvoiceProof", "Expected AddInvoiceProof event");
            assert.equal(event2.args.txHash, bytesData2, "Expected txHash is " + bytesData2);
            assert.equal(event2.args.data, stringData2, "Expected data is " + stringData2);

            const invoiceProof3 = await invoiceProofContract.add(bytesData3, stringData3, { from: owner });
            const events3 = invoiceProof3.logs;
            assert.isArray(events3, 'Events is not array!');
            assert.lengthOf(events3, 1, 'The Events array has length of 1!');

            const event3 = events3[0];
            assert.equal(event3.event, "AddInvoiceProof", "Expected AddInvoiceProof event");
            assert.equal(event3.args.txHash, bytesData3, "Expected txHash is " + bytesData3);
            assert.equal(event3.args.data, stringData3, "Expected data is " + stringData3);
        });

        it("should the owner get the correct invoice proof data", async () => {
            const invoiceProof = await invoiceProofContract.add(bytesData1, stringData1, { from: owner });
            const events = invoiceProof.logs;
            assert.isArray(events, 'Events is not array!');
            assert.lengthOf(events, 1, 'The Events array has length of 1!');

            const event = events[0];
            assert.equal(event.event, "AddInvoiceProof", "Expected AddInvoiceProof event");
            assert.equal(event.args.txHash, bytesData1, "Expected txHash is " + bytesData1);
            assert.equal(event.args.data, stringData1, "Expected data is " + stringData1);

            const invoiceProofData = await invoiceProofContract.read(bytesData1, { from: owner });
            assert.equal(invoiceProofData, stringData1, "Expected data is " + stringData1);
        });

        it("should end user get the correct invoice proof data", async () => {
            const invoiceProof = await invoiceProofContract.add(bytesData1, stringData1, { from: owner });
            const events = invoiceProof.logs;
            assert.isArray(events, 'Events is not array!');
            assert.lengthOf(events, 1, 'The Events array has length of 1!');

            const event = events[0];
            assert.equal(event.event, "AddInvoiceProof", "Expected AddInvoiceProof event");
            assert.equal(event.args.txHash, bytesData1, "Expected txHash is " + bytesData1);
            assert.equal(event.args.data, stringData1, "Expected data is " + stringData1);

            const invoiceProofData = await invoiceProofContract.read(bytesData1, { from: user });
            assert.equal(invoiceProofData, stringData1, "Expected data is " + stringData1);
        });

        it("should fail to add two identical txHash invoice proofs", async () => {
            const invoiceProof = await invoiceProofContract.add(bytesData1, stringData1, { from: owner });
            const events = invoiceProof.logs;
            assert.isArray(events, 'Events is not array!');
            assert.lengthOf(events, 1, 'The Events array has length of 1!');

            const event = events[0];
            assert.equal(event.event, "AddInvoiceProof", "Expected AddInvoiceProof event");
            assert.equal(event.args.txHash, bytesData1, "Expected txHash is " + bytesData1);
            assert.equal(event.args.data, stringData1, "Expected data is " + stringData1);

            await expectThrow(invoiceProofContract.add(bytesData1, stringData1, { from: owner }));
        });

        it("should fail to add invoice proof bacause empty data", async () => {
            await expectThrow(invoiceProofContract.add(bytesData1, "", { from: owner }));
        });

        it("should fail to add invoice proof bacause is not the owner", async () => {
            await expectThrow(invoiceProofContract.add(bytesData1, stringData1, { from: user }));
        });
    });
});
