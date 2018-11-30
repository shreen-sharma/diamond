import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';

const log = new Logger('SystemManager');

@Component({
  selector: 'system-manager',
  templateUrl: './systemManager.html',
  styleUrls: ['./systemManager.scss']
})
export class SystemManager {
  
  constructor(private router: Router, private authService: AuthenticationService) {
    
  }
}
