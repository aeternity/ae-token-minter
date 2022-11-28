import { Component } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { AeternityService } from '../../../services/aeternity.service';
import * as dayjs from 'dayjs'

@Component({
  selector: 'ngx-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DatepickerComponent {
  
  min: Date;
  max: Date;

  nfts =
  [{
    nftBaseUrl: '',
    nftName: 'Loading...',
    nftSymbol: "Loading...",
    nftMinted: "Loading...",
    nftDescription: "Loading..."
    }];
/*   nfts =
  [{
    nftBaseUrl: 'https://www.tierfreund.de/wp-content/uploads/2016/09/1.jpg',
    nftName: 'Test'
    }]; */

    
  constructor(protected dateService: NbDateService<Date>, aeService: AeternityService) {

    (async () => {
      
      
      // setTimeout(async () => {
        // aeService.readNftDataFrom("ct_2GXBBp9BdAytxRPDYropAKUQJxgeZBiufuktBbPxB3dk2JGUWR")
        let  [metaInfo, nftDataFromContract] = await aeService.readNftDataFrom("ct_jYugRQynbQZxtGKLGaRH8HDZH53pH71j6cr7V5YZdvf18B3Sx")
        
        console.log("nfts:", nftDataFromContract)
        
        this.nfts = nftDataFromContract.map((nft) => {return {
          nftName : nft.get('name'),
          nftBaseUrl : nft.get('media_url'),
          nftDescription : nft.get('description'),
          nftSymbol: metaInfo.symbol,
          nftMinted: dayjs(1669636502271).format('DD MMM YYYY')
          
        }})
        
      })()
      
// }, 3500);

  }
}
