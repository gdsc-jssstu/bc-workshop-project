import Web3 from "web3";
import Identicon from "identicon.js";
import SasthaTwitterContract from "../../build/contracts/SasthaTwitter.json";
import { createPost, getAllPosts } from "./app.js";

/*** VARIABLES */
var CONTRACT;
var ACCOUNT;

/*** EVENT LISTENERS */
const btn = document.getElementById("form-post-content");
btn.addEventListener("submit", (event) => {
  event.preventDefault();
  createPost(event.target["content"].value);
});

/*** CONNECT & LOAD BLOCKCHAIN */
async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
}

async function loadBlockchainData() {
  const web3 = window.web3;
  //Load accounts
  const accounts = await web3.eth.getAccounts();
  //Add first account the the state
  ACCOUNT = accounts[0];
  // console.log(accounts);

  //Get network ID
  const networkId = await web3.eth.net.getId();
  //Get network data
  const address = SasthaTwitterContract.networks[networkId].address;
  const abi = SasthaTwitterContract.abi;

  //Check if net data exists, then
  if (networkId) {
    //Assign contract to a variable
    CONTRACT = new web3.eth.Contract(abi, address);
    // console.log(CONTRACT);

    document.getElementById("account").innerText = ACCOUNT;
    document.getElementById("balance").innerText =
      (await web3.eth.getBalance(ACCOUNT)) / 10 ** 18 + " ETH";
    document.getElementById(
      "account-identicon"
    ).src = `data:image/png;base64,${new Identicon(ACCOUNT, 30).toString()}`;

    // Get data
    await getAllPosts(CONTRACT, ACCOUNT);
  } else {
    //If network data doesn't exists, log error
    alert(" Contract is not deployed to detected network!!!");
  }
}

window.onload = () => {
  console.log("Welcome to Sastha DApp!");
  loadWeb3().then(() => loadBlockchainData());
};
