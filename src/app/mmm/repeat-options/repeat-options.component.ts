import { Component, OnInit } from '@angular/core';
import {RepeatOptionsService} from './repeat-options.service';

@Component({
  selector: 'app-repeat-options',
  templateUrl: './repeat-options.component.html',
  styleUrls: ['./repeat-options.component.css']
})
export class RepeatOptionsComponent implements OnInit {

  repeatOptions$ = this.repeatOptionsService.repeatOptions$;

  constructor(private repeatOptionsService: RepeatOptionsService) {
  }

  ngOnInit(): void {
  }


}
