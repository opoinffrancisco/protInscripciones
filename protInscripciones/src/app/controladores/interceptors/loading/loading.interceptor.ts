import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './../../util/loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private countRequest = 0;

  constructor(private loadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.countRequest) {
        this.loadingService.show();
    }
    this.countRequest++;
    
    return next.handle(req).pipe(
        finalize(() => {
            this.countRequest--;
            if (!this.countRequest) {
               this.loadingService.hide();
            }
        })
    )
  }


}
