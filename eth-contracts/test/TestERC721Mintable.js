var ERC721MintableComplete = artifacts.require('AdmanToken');

contract('TestERC721Mintable', accounts => {

    const account_one   = accounts[0];
    const account_two   = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const TOTAL_SUPPLY = 4;
    const BALANCE = 3;

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new("ADMANTESTTKN", "ADMT", {from: account_one});
            let owner = await this.contract._owner.call();

            // mint multiple tokens
            await this.contract.mint(account_two, 1, {from: account_one});
            await this.contract.mint(account_two, 2, {from: account_one});
            await this.contract.mint(account_two, 3, {from: account_one});
            await this.contract.mint(account_one, 4, {from: account_one});

        })

        it('should return total supply', async function () {
            this.contract.totalSupply.call({from: account_one}).then((total_supply) => {
                assert.equal(total_supply, TOTAL_SUPPLY, "Should have a totalSupply of "+TOTAL_SUPPLY);
            })
        })

        it('should get token balance', async function () { 
            this.contract.balanceOf.call(account_two, {from: account_one}).then((balance) => {
                assert.equal(balance, BALANCE, "Should have a balance of: "+BALANCE);
            })
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return a correct token uri', async function () {
            let token_id_for_url_check = 2;
            let url_to_check_token_2 = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2";

            this.contract.tokenURI.call(token_id_for_url_check).then((url) => {
                assert.equal(url, url_to_check_token_2, "Should have the url: "+url_to_check_token_2);
            })
        })

        it('should transfer token from one owner to another', async function () {
            token_id_for_ownership_check = 1;

            await this.contract.transferFrom(account_two, account_four, token_id_for_ownership_check, {from: account_two});
            this.contract.ownerOf.call(token_id_for_ownership_check).then((account) =>
                                        {
                                            assert.equal(account, account_four, "The owner should be: "+account_four);
                                        })
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("ADMANTESTTKN", "ADMT", {from: account_one});

        })

        it('should fail when minting, if the address is not of the contract"s owner', async function () {
            try {
                await this.contract.mint(account_two, 4, {from: account_four});
            }catch(e){
                assert.include(e.message, 'The used address is not the owner of the contract, operation not allowed')
            }
        })

        it('should return the contract owner', async function () {
            let owner_address = await this.contract.getOwnerAddress({from: account_one});
            assert.equal(owner_address, account_one, "The owner address should be the address: "+account_one);
        })

    });
})