import { Component, OnInit } from '@angular/core';
import {RepeatOptionsService} from '../repeat-options/repeat-options.service';
import {TaxExemptionsService} from './tax-exemptions.service';

@Component({
  selector: 'app-tax-exemptions',
  templateUrl: './tax-exemptions.component.html',
  styleUrls: ['./tax-exemptions.component.css']
})
export class TaxExemptionsComponent implements OnInit {

  taxExemptions$ = this.taxExemptionsService.taxExemptions$;

  constructor(private taxExemptionsService: TaxExemptionsService) {
  }

  ngOnInit(): void {
  }


}
