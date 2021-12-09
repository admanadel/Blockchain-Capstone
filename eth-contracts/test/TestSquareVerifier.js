var Verifier         = artifacts.require('Verifier');
let asset            = require('../config/proof.json');
let bad_asset        = require('../config/badProof.json');

contract('TestSquareVerifier', accounts => {

    const account_one   = accounts[0];

    describe('init square verifier', function () {
        beforeEach(async function () {
            this.contractVerifier = await Verifier.new({from: account_one});
        })

    it('use the contents from proof.json generated from zokrates steps', async function () {

        let verification =  await this.contractVerifier.verifyTx(
                asset.proof.a,
                asset.proof.b,
                asset.proof.c,
                asset.inputs,
                {from:account_one}
            );

        assert.include(JSON.stringify(verification.logs), 'Verified');
    })

    it('Test verification with incorrect proof', async function () {

        try {
           let verification =  await this.contractVerifier.verifyTx(bad_asset.proof.a,
                                                                    bad_asset.proof.b,
                                                                    bad_asset.proof.c,
                                                                    bad_asset.inputs,
                                                                    {from:account_one});

           assert.equal(false, verification, "Verification should return false");
        }catch(e){
           assert.include(JSON.stringify(e), 'invalid opcode');
        }
    })
  })
})