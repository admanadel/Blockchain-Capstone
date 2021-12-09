pragma solidity ^0.5.0;

import "./AdmanToken.sol";
import "./verifier.sol";


// contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is AdmanToken{
    using SafeMath for uint256;

    uint256 solutionsIndex = 1;

    // solutions struct that can hold an index & an address
    struct Solution {
        uint256 tokenId;
        address account;
        bool    alreadyExists;
    }

    Verifier proofVerifier;

    constructor(address verifiersContractAddress, string memory name, string memory symbol)
    AdmanToken(name, symbol) public{
        // contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
        proofVerifier = Verifier(verifiersContractAddress);
    }

    // array of the above struct
    Solution[] private _solutions;

    // mapping to store unique solutions submitted
    mapping(uint256 => Solution) private submittedSolutions;

    // event to emit when a solution is added
    event SolutionAdded(address account);

    function solutionExists(uint256 tokenId) public returns(bool){
        return submittedSolutions[tokenId].alreadyExists;
    }

    // add the solutions to the array and emit the event
    function addSolution(address account, uint256 tokenId) private{

        _solutions.push(Solution({tokenId: tokenId, account: account, alreadyExists: true}));
        submittedSolutions[tokenId] = Solution({tokenId: tokenId, account: account, alreadyExists: true});
        solutionsIndex++;
        emit SolutionAdded(account);
    }


    // mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(
                   uint[2] memory a,
                   uint[2][2] memory b,
                   uint[2] memory c,
                   uint[2] memory input,
                   uint256 tokenId) public{

        require(proofVerifier.verifyTx(a, b, c, input), "Impossible to verify proof.");
        require(submittedSolutions[tokenId].alreadyExists==false, "This proof already submitted.");

        addSolution(msg.sender, tokenId);

        mint(msg.sender, tokenId);
    }

}
