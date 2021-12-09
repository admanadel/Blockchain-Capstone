var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier     = artifacts.require('Verifier');
let asset        = require('../config/proof.json');

contract('TestSolnSquareVerifier', accounts => {

    const account_one   = accounts[0];
    const account_two   = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const BALANCE = 1;


    describe('init SolnSquareVerifier', function () {
        beforeEach(async function () {
            let name   ="Laval Token";
            let symbol ="LVL";
            this.contractVerifier = await Verifier.new({from: account_one});
            this.contractSolnSquare = await SolnSquareVerifier.new(this.contractVerifier.address,
                                                                     name,
                                                                     symbol,
                                                                     {from: account_one});

        })

        it('a new solution can be added for contract - SolnSquareVerifier', async function () {
            let tokenId = 1;
            let mint =  await this.contractSolnSquare.mint(
                    asset.proof.a,
                    asset.proof.b,
                    asset.proof.c,
                    asset.inputs,
                    tokenId,
                    {from:account_one}
                );

            assert.include(mint.logs[0].event, 'SolutionAdded');
            assert.include(mint.logs[1].event, 'Transfer');

        })

        it('test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function () {
            let tokenId = 1;
            await this.contractSolnSquare.balanceOf.call(account_one, {from: account_one}).then((balance) => {
                assert.equal(balance, 0, "Should have a balance of: "+0);
            })

            await this.contractSolnSquare.mint(
                    asset.proof.a,
                    asset.proof.b,
                    asset.proof.c,
                    asset.inputs,
                    tokenId,
                    {from:account_one}
            );

            this.contractSolnSquare.balanceOf.call(account_one, {from: account_one}).then((balance) => {
                assert.equal(balance, BALANCE, "Should have a balance of: "+BALANCE);
            })

        })
    });
})