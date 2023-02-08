import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Camera, SecurityCamerasData } from '../../../@core/data/security-cameras';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AbstractControl, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AeternityService } from '../../../services/aeternity.service';
// import { aex141nft } from '../../../interfaces/NFT';
import { aex141nftContract } from '../../../../assets/contracts/aex141-nft-collection-example/MintableMappedMetadataNFT-flattened.aes'
import { StateService } from '../../../@core/utils';
import { WalletConnectionStatus } from '../../../services/aeternity.service'
import { NbPopoverDirective } from '@nebular/theme';
import FUNGIBLE_TOKEN_CONTRACT from 'aeternity-fungible-token/FungibleTokenFull.aes';

/* import {
  MonacoEditorComponent,
  MonacoEditorConstructionOptions,
  MonacoEditorLoaderService,
  MonacoStandaloneCodeEditor
} from '@materia-ui/ngx-monaco-editor'; */

import type  { MonacoEditorConstructionOptions } from '@materia-ui/ngx-monaco-editor/lib/interfaces/'

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
  deployedTokenAddress: string = 'foo';
  tokenData: FormGroup;
  burnable = true
  mintable = false

  /* dApp related end  */
  

  /* code previewer start  */
  editorOptions : MonacoEditorConstructionOptions = {theme: 'vs-dark', 
  language: 'aes', 
  fontSize: 14,
  cursorBlinking: 'phase', 
  cursorSmoothCaretAnimation: true,
  contextmenu: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  smoothScrolling: true,
  readOnly: true,
};

  /* code: string = 'function x() {\nconsole.log("Hello world!");\n}'; */
  code: string = FUNGIBLE_TOKEN_CONTRACT;
  /* code previewer end  */

  /* helpers start  */
  walletConnectionStatus = WalletConnectionStatus;

  constructor(
    private securityCamerasService: SecurityCamerasData,
    public aeService: AeternityService,
    public state : StateService,
    /* private monacoLoaderService: MonacoEditorLoaderService, */
  ){
    this.isSingleView = true; // UI
    
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

    this.deployedTokenAddress = null
    this.showSpinnerOnMintButton = true;

    const name = this.tokenData.get('tokenName').value
    const decimals = this.tokenData.get('tokenDecimals').value
    const symbol = this.tokenData.get('tokenSymbol').value
    const balanceOwner = this.tokenData.get('tokenBalanceOwner').value

    const contract = await this.aeService.aeSdk.getContractInstance({
      source: FUNGIBLE_TOKEN_CONTRACT
    });
    
    try {
    const deployed = await contract.deploy([
      name,
      decimals,
      symbol,
      `${balanceOwner}${'0'.repeat(decimals)}`,
    ]);
  
      console.log("--------> deployed:", deployed)
      this.showSpinnerOnMintButton = false;
      this.deployedTokenAddress = deployed.address
    } catch (error) {
      console.error("--------> error:", error);

    } 

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
interface contractFeatureOptions {
  burnable: boolean,
  mintable: boolean,
}