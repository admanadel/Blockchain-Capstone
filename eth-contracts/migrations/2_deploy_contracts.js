// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./verifier.sol");
var AdmanToken = artifacts.require("./AdmanToken.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
let SYMBOL = "ADMT";
let NAME   = "ADMAN TOKEN TEST";

module.exports = async function(deployer) {

  await deployer.deploy(SquareVerifier);
  await deployer.deploy(AdmanToken, NAME, SYMBOL);
  SolnSquareVerifierInst = await deployer.deploy(SolnSquareVerifier, SquareVerifier.address, NAME, SYMBOL);

  for(tokenId=1;tokenId<=10;tokenId++){
    var asset  = require('../config/proof.json');
    var res = await SolnSquareVerifierInst.mint(asset.proof.a,
                                      asset.proof.b,
                                      asset.proof.c,
                                      asset.inputs,
                                      tokenId);

    console.log(res);
  }
};
