import { Component } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { AeternityService } from '../../../services/aeternity.service';
import * as dayjs from 'dayjs'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ngx-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DatepickerComponent {
  
  min: Date;
  max: Date;

  private sub: Subscription;
  nftContractAddress: string = ''

  notFound : boolean = false

  nfts =
  [{
    nftBaseUrl: '',
    nftName: 'Loading...',
    nftSymbol: "Loading...",
    nftMinted: "Loading...",
    nftDescription: "Loading...",
    nftOwner : "Loading..."
    }];
/*   nfts =
  [{
    nftBaseUrl: 'https://www.tierfreund.de/wp-content/uploads/2016/09/1.jpg',
    nftName: 'Test'
    }]; */

    
  constructor(protected dateService: NbDateService<Date>, aeService: AeternityService, private route: ActivatedRoute) {
    this.sub = this.route.params.subscribe(params => {
      this.nftContractAddress = params['contractAddress'];
      
      (async () => {
        
        try {
          
          let  [metaInfo, nftDataFromContract, owner] = await aeService.readNftDataFrom(this.nftContractAddress)
          
          console.log("nfts:", nftDataFromContract)
          
          this.nfts = nftDataFromContract.map((nft) => {return {
            nftName : nft.get('name'),
            nftBaseUrl : nft.get('media_url'),
            nftDescription : nft.get('description'),
            nftSymbol: metaInfo.symbol,
            nftMinted: dayjs(1669636502271).format('DD MMM YYYY'),
            nftOwner: owner
          }})
        } catch(e) {
          this.notFound = true
          console.log('bogus address:', e)
        }

        }
        
        )()
           
      
      
      }
           
           
           );

// }, 3500);

  }
}
