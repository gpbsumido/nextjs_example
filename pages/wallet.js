import React from "react";
import { useAccount, useConnect, useDisconnect,useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
 
export default function Wallet() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect();

  const { signMessageAsync } = useSignMessage();
  const [displayDiv,setDisplayDiv] = useState(<div></div>);

  //listener for esc ket close modal
  useEffect(() => {
    let div = <div></div>;
    if (isConnected) {
      div = 
        <div>
          Connected to {address}
          <button onClick={() => disconnect()}>Disconnect</button>
          <button
            onClick={()=>{
              const message = `Welcome to Paul's Photography Page`;
              signMessageAsync({message}).then((resp)=>{
                toast(resp);
              }).catch((e)=>{
                toast.error(e)
              })
            }}
          >Sign Message</button>
        </div>
    } else {
      div = 
        <button onClick={() => connect()}>Connect Wallet</button>
    }
    setDisplayDiv(div)
  }, [isConnected]);

 
  return (
    <div>
      { displayDiv }
    </div>
  )
}