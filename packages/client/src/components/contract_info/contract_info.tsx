import {ethers} from "ethers";
import {contractAddress, abi} from "../../assets/abi/fanatix.json";
import { metamaskWallet, useConnect, useConnectionStatus , useWallet, useAddress} from "@thirdweb-dev/react";


const mintingContract = async() => {
    const contract = new ethers.Contract(contractAddress, abi, useWallet.arguments);
    await contract.initialize("tokenURI");
    await contract.createTier(1, 10);
    await contract.createTier(2, 10);
    await contract.createTier(3, 10);
    console.log("contract created");
}

const mintingNFT = async() => {
    const contract = new ethers.Contract(contractAddress, abi, useWallet.arguments);
    var val = await contract.composeLDA_ID(1,1);
    await contract.mintfantixToOwner(useAddress,val,"data",1);
}

const uniqueNFTId = async() => {
    const contract = new ethers.Contract(contractAddress, abi, useWallet.arguments);
    var val = await contract.composeLDA_ID(1,1);
    return val;
}

const tierMaxSupply = async() => {
    const contract = new ethers.Contract(contractAddress, abi, useWallet.arguments);
    const tier1 = await contract.tierMaxSupply(1);
    const tier2 = await contract.tierMaxSupply(2);
    const tier3 = await contract.tierMaxSupply(3);
    console.log(tier1 + " " + tier2 + " " + tier3);
} 

const ownerOfNFT= async() => {
    const contract = new ethers.Contract(contractAddress, abi, useWallet.arguments);
    const owner = await contract.ownerOf(10); //Id of the NFT
}


