import { Injectable } from '@angular/core';
/* import {
  BrowserWindowMessageConnection,
  SUBSCRIPTION_TYPES,
  AE_AMOUNT_FORMATS
} from '@aeternity/aepp-sdk/dist/aepp-sdk.browser.js';
 */
import { AeSdkAepp, Node, walletDetector, BrowserWindowMessageConnection, AE_AMOUNT_FORMATS, SUBSCRIPTION_TYPES } from "@aeternity/aepp-sdk";
import { aex141nftContract } from '../../assets/contracts/aex141-nft-collection-example/MintableMappedMetadataNFT-flattened.aes'

import { environment } from '../../environments/environment';
import { Observable, of} from 'rxjs';
const aex141Aci = require('../../assets/contracts/aex141-nft-collection-example/MintableMappedMetadataNFT-flattened-aci.json')
const { projectName, networkId, nodeUrl, nodeCompilerUrl } =
  environment;

  export enum WalletConnectionStatus {
    Error = 0 ,
    Connecting,
    Connected,
  }

@Injectable({
  providedIn: 'root',
})
export class AeternityService {
  aeSdk?: AeSdkAepp;
  sdkState: {
    error?: string,
    address?: `ak_${string}`,
    balance?: string,
    height?: number,
    nodeUrl?: string,
  } = {};

  deployedNftAddress = '';

  walletConnectionStatus: WalletConnectionStatus = WalletConnectionStatus.Connecting
  sdkStateObservable: Observable<Object>;

  constructor() { 
    const onNetworkChange = (params : any ) => {
      this.showWalletInfo(params.networkId);
    };

    this.initSDK(onNetworkChange)
    .then( async ({walletNetworkId, aeSdk} : {walletNetworkId: string, aeSdk: AeSdkAepp}) => {
      this.aeSdk = aeSdk;
      console.log("Initialised sdk");

      const test = await this.showWalletInfo(walletNetworkId);

  });

  }

  async showWalletInfo(walletNetworkId: string) {
    
    if (walletNetworkId !== networkId) {
      this.sdkState.error = `Connected to the wrong network "${walletNetworkId}". please switch to "${networkId}" in your wallet.`;
      this.walletConnectionStatus = WalletConnectionStatus.Error;
      return;
    }
    if (this.aeSdk == null) {
      this.sdkState.error = `SDK instance is not ready yet.`;
      this.walletConnectionStatus = WalletConnectionStatus.Error;
      return;
    }

    this.sdkState.address = await this.aeSdk.address();
    this.sdkState.balance = await this.aeSdk.getBalance(this.sdkState.address, {
      format: AE_AMOUNT_FORMATS.AE,
    });
    this.sdkState.height = await this.aeSdk.height();
    console.log(this.sdkState);
   
    // this.sdkState.nodeUrl = (await this.aeSdk.getNodeInfo()).url;
    this.walletConnectionStatus = WalletConnectionStatus.Connected;
    this.sdkStateObservable = new Observable((observer) => {
      observer.next(this.sdkState);
      observer.complete();
    });

  }

  async initSDK(onNetworkChange: any) {
    this.aeSdk = new AeSdkAepp({
      name: projectName,
      nodes: [
        {
          name: networkId,
          instance: new Node(nodeUrl),
        },
      ],
      compilerUrl: nodeCompilerUrl,
      onAddressChange:  ({ current }) => console.log('new address'),
      // TODO: adjust view to display change
      onNetworkChange,
      onDisconnect: () => {
        return new Error('Disconnected');
      },
    });

    const walletNetworkId: string = await this.scanForWallet();
    return { walletNetworkId, aeSdk: this.aeSdk};
  }

  async readNftDataFrom(contractAddress: string){
    // const contract = await this.aeSdk.getContractInstance({ address: contractAddress, source: aex141nftContract });
    
    // const aci = await this.aeSdk!.
    // source ^.{1,60}?\{ source.*?\:.*?}.{4,60}
    const contract = await this.aeSdk!.getContractInstance({
      // aci: aex141Aci,
      source: aex141nftContract,
      contractAddress: contractAddress,
    });

    
    
    let metaInfo = await contract.methods
    .meta_info()
    .then((res) => res.decodedResult);
    
    console.log("meta info:", metaInfo);
    
    let { decodedResult : metadata } = await contract.methods.metadata(1);
    let { decodedResult : owner } = await contract.methods.owner(1);
    return [metaInfo, metadata["MetadataMap"], owner]

    /* let nfts = await Promise.all(
      [...new Array(1)].map(async (_, i) => {
        const { decodedResult: metadata } = await contract.methods.metadata(
          i + 1
        );
        }
      )) */

    }


  async scanForWallet(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.aeSdk) throw new Error('Failed! SDK not initialized.');
      const handleNewWallet = async ({ wallets, newWallet } : any) => {
        newWallet = newWallet || Object.values(wallets)[0]
        await this.aeSdk!.connectToWallet(await newWallet.getConnection());
        await this.aeSdk!.subscribeAddress(SUBSCRIPTION_TYPES.subscribe, 'current');
        stopScan();
        resolve(newWallet.info.networkId);
      };
      const scannerConnection = new BrowserWindowMessageConnection();
      const stopScan = walletDetector(scannerConnection, handleNewWallet.bind(this));
    });
  }
}

