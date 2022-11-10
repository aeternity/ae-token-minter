import { Injectable } from '@angular/core';
import {
  AeSdkAepp,
  Node,
  walletDetector,
  BrowserWindowMessageConnection,
  SUBSCRIPTION_TYPES,
  AE_AMOUNT_FORMATS
} from '@aeternity/aepp-sdk/dist/aepp-sdk.browser.js';
import { environment } from '../../environments/environment';
import { Observable, of} from 'rxjs';
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

  status: WalletConnectionStatus = WalletConnectionStatus.Connecting
  WalletConnectionStatus = WalletConnectionStatus
  sdkStateObservable: Observable<Object>;

  constructor() { 
    const onNetworkChange = (params : any ) => {
      this.showWalletInfo(params.networkId);
    };

  }

  async showWalletInfo(walletNetworkId: string) {
    
    if (walletNetworkId !== networkId) {
      this.sdkState.error = `Connected to the wrong network "${walletNetworkId}". please switch to "${networkId}" in your wallet.`;
      this.status = WalletConnectionStatus.Error;
      return;
    }
    if (this.aeSdk == null) {
      this.sdkState.error = `SDK instance is not ready yet.`;
      this.status = WalletConnectionStatus.Error;
      return;
    }

    this.sdkState.address = await this.aeSdk.address();
    this.sdkState.balance = await this.aeSdk.getBalance(this.sdkState.address, {
      format: AE_AMOUNT_FORMATS.AE,
    });
    this.sdkState.height = await this.aeSdk.height();
    console.log(this.sdkState);
   
    // this.sdkState.nodeUrl = (await this.aeSdk.getNodeInfo()).url;
    this.status = WalletConnectionStatus.Connected;
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
          // instance: new Node('http://dontfetchme.de'),
        },
      ],
      compilerUrl: nodeCompilerUrl,
      onAddressChange:  ({ current }) => console.log('new address'),
      onNetworkChange,
      onDisconnect: () => {
        return new Error('Disconnected');
      },
    });

    const walletNetworkId: string = await this.scanForWallet();
    return { walletNetworkId, aeSdk: this.aeSdk};
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

