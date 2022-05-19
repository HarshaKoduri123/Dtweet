import {
  Link,
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import DecentratwitterAbi from './contractsData/dtweet.json'
import DecentratwitterAddress from './contractsData/dtweet-address.json'
import { Spinner, Navbar, Nav, Button, Container } from 'react-bootstrap'
import Home from './Home.js'
import Profile from './Profile.js'
import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState({})

  const web3Handler = async () => {
    try {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0])

      // Setup event listeners for metamask
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', async () => {
        setLoading(true)
        web3Handler()
      })
      // Get provider from Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // Get signer
      const signer = provider.getSigner()
      loadContract(signer)
    } catch (error) {
      console.log(error);
    }
    
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setAccount(account)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Get signer
        const signer = provider.getSigner()
        loadContract(signer)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loadContract = async (signer) => {

    // Get deployed copy of Decentratwitter contract
    try {
      const contract = new ethers.Contract(DecentratwitterAddress.address, DecentratwitterAbi.abi, signer)
      setContract(contract)
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    
  }
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
    <BrowserRouter>
      <div className="App" style={{backgroundColor : 'black', height: '100%' }}>
        <>
          <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
              <Navbar.Brand href="http://www.dappuniversity.com/bootcamp">
                &nbsp; Dtweet
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                </Nav>
                <Nav>
                  {account ? (
                    <Nav.Link
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button nav-button btn-sm mx-4">
                      <Button variant="outline-light">
                        {account.slice(0, 5) + '...' + account.slice(38, 42)}
                      </Button>

                    </Nav.Link>
                  ) : (
                    <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
        <div style={{color : 'white'}}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <p className='mx-3 my-0'>Please connect to Metamask</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home contract={contract} />
              } />
              <Route path="/profile" element={
                <Profile contract={contract} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;