import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Camera, SecurityCamerasData } from '../../../@core/data/security-cameras';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AeternityService } from '../../../services/aeternity.service';
// import { aex141nft } from '../../../interfaces/NFT';
import { aex141nftContract } from '../../../../assets/contracts/aex141-nft-collection-example/MintableMappedMetadataNFT-flattened.aes'
import { StateService } from '../../../@core/utils';
import { WalletConnectionStatus } from '../../../services/aeternity.service'
import { NbPopoverDirective } from '@nebular/theme';

@Component({
  selector: 'ngx-form-layouts',
  styleUrls: ['./fungible-token.component.scss'],
  templateUrl: './fungible-token.component.html',
})
export class FungibleTokenComponent {

  @ViewChildren(NbPopoverDirective) popovers: QueryList<NbPopoverDirective>;

  /* view-related start */
  isSingleView : boolean;
  actionSize = 'medium';
  showSpinnerOnMintButton = false;

  private destroy$ = new Subject<void>();
  cameras: Camera[];
  selectedCamera: Camera;

  walletInstallPromptCanBeShown : boolean = false
  /* view-related end  */


  /* dApp related start */
  tokenData: FormGroup;

  contractTypeOption = 'basic' // needs to correspond the default active contract type
  contractTypes = [
    { label: 'Basic NFT', value: 'basic', checked: true },
    { label: 'Mintable / Burnable', value: 'mintable' },
  ];

  deployedNftAddress; // contract address of the deployed NFT

  /* dApp related end  */
  
  /* helpers start  */
  walletConnectionStatus = WalletConnectionStatus;

  constructor(
    private securityCamerasService: SecurityCamerasData,
    public aeService: AeternityService,
    public state : StateService
  ){
    this.isSingleView = true; // UI

/*     const onNetworkChange = (params : any ) => {
      // TODO: Make a toast for network changes
      // TODO: Display warning when on wrong network
      console.log("Network change:", params.networkId);
    }; */

    
  }

  ngOnInit() {

 /*    setInterval(()=> {
      console.log('popovers?', this.popovers)
      
      let onePopover : NbPopoverDirective = this.popovers["_results"][0]
      onePopover.show()

    }, 2000) */

    this.tokenData = new FormGroup({
      tokenName: new FormControl(null, [Validators.required]),
      tokenSymbol: new FormControl("", [Validators.required]),
      tokenDecimals: new FormControl("18", [Validators.required, , Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      tokenBalanceOwner: new FormControl("", [Validators.required]),

      
    })
    
    this.setInputFieldWarningPopovers()



    /* this.setInputFieldWarningPopovers();  */
    
    setInterval(() => {
      console.log( "Name invalid?", this.tokenData.controls['tokenName'].invalid)

    }, 2000)

    setTimeout(() => {
      this.walletInstallPromptCanBeShown = true
    }, 2000);

 
    // setInterval(()=> {console.log(this.contractTypeOption)},3000)

    this.securityCamerasService.getCamerasData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cameras: Camera[]) => {
        this.cameras = cameras;
        this.selectedCamera = this.cameras[0];
      });

      /* setInterval(() => {console.log(this.nftData)}, 3000) */
  }


  checkValidity(inputName : string){
    // assuming there are only VALID and INVALID statuses right now.
    let isValid : boolean =  (this.tokenData.controls[inputName] as AbstractControl).status == "INVALID" ? false : true
    this.setPopoverVisible(inputName, !isValid, 3000)

  }

  setInputFieldWarningPopovers() {

    Object.keys(this.tokenData.controls).forEach(input => {
      
      this.tokenData.controls[input].valueChanges
      .subscribe((data) => {
        this.tokenData.controls[input].invalid ?
        this.setPopoverVisible(input, true, 3000) :
        this.setPopoverVisible(input, false)
      })      
    });

  }

  setPopoverVisible(id : string, show: boolean, hideAfter? : number) {
    let popovers : Array<NbPopoverDirective> = this.popovers["_results"]
    let onePopover : NbPopoverDirective = popovers.find(element => element.context == id)
    show ?
    onePopover.show() :
    onePopover.hide()
    if (show == true && hideAfter) {
      setTimeout(() => {
        onePopover.hide();
      }, hideAfter);
    }
  }

  async mint() {

    this.aeService.deployedNftAddress = ''
    this.showSpinnerOnMintButton = true;
    // TODO mint multiple NFTs; 
    // MVP - mint only one NFT into the new contract
    const nfts = [
      {
        "name": this.tokenData.get('nftName').value,
        "description": this.tokenData.get('nftDescription').value,
        "media_type": "IMAGE",
        "media_url": this.tokenData.get('nftBaseUrl').value
      }
    ];
/*     const nfts : Array<aex141nft> = [
      {
        "name": this.nftData.get('nftName').value,
        "description": this.nftData.get('nftDescription').value,
        "media_type": "IMAGE",
        "media_url": this.nftData.get('nftBaseUrl').value,
        "immutable_attributes": {
            "apes_count": 2,
            "moon_visible": true
        },
        "mutable_attributes": {
            "retries": 0
        }
      }
    ]; */

    const senderAddress = await this.aeService.sdkState.address;

    // const CONTRACT = './../../../../assets/contracts/aex141-nft-collection-example/MintableMappedMetadataNFT-flattened.aes';
    const source = aex141nftContract;

    console.log("Compiling....");
    const contract = await this.aeService.aeSdk.getContractInstance({ source });

    // deploy
    console.log("Deploying with: ",this.tokenData.get('nftBaseUrl').value, this.tokenData.get('nftSymbol').value, 1);
    //debugger
    await contract.deploy([
      this.tokenData.get('nftName').value,
      this.tokenData.get('nftSymbol').value,
      1 // "token limit - harcode for now
    ]); 

/*     await contract.deploy([
        "Test",
        "Test"
    ]); */

 
    console.log(`Contract successfully deployed!`);
    console.log(`Contract address: ${contract.deployInfo.address}`);
    console.log(`Tx-Hash: ${contract.deployInfo.txData.hash}`);
    console.log(`Gas used: ${contract.deployInfo.result.gasUsed}`);
    console.log(`------------------------------------------------------------------------------------------`);
    console.log(`------------------------------------------------------------------------------------------`);

    // mint
    for(let i=0; i<nfts.length; i++) {
        const nftMetadataMapStringValues = new Map(Object.entries(nfts[i]).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : v]));
        console.log("Feeding the contract:", nftMetadataMapStringValues)
        const tx = await contract.methods.mint(
            senderAddress,
            {'MetadataMap': [nftMetadataMapStringValues]}
        );
        console.log(`Minted '${nftMetadataMapStringValues.get('name')}' with id '${tx.decodedResult}'`);
        console.log(`Tx-Hash: ${tx.hash}`);
        console.log(`Gas used: ${tx.result.gasUsed}`);
        console.log(`------------------------------------------------------------------------------------------`);
        console.log(`------------------------------------------------------------------------------------------`);
    };
    this.aeService.deployedNftAddress = contract.deployInfo.address;
    this.showSpinnerOnMintButton = false;

    this.deployedNftAddress = contract.deployInfo.address;
  }
 
  log(event){
    console.log("Form group: ", event)
  }

  ngOnDestroy(){
       //TODO: Store subscriptions from above, and unsubscribe in here.
  }
  // setContractTypeOptionChecked(option){
  //   this.
  // }

}
