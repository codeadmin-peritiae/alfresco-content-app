/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { LogoutComponent } from './logout.component';
import { Store } from '@ngrx/store';
import { SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { AppConfigService, AuthenticationService } from '@alfresco/adf-core';

describe('LogoutComponent', () => {
  let fixture: ComponentFixture<LogoutComponent>;
  let component: LogoutComponent;
  let store;
  let authService: AuthenticationService;
  let appConfig: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [LogoutComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch')
          }
        }
      ]
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(LogoutComponent);
    appConfig = TestBed.inject(AppConfigService);
    authService = TestBed.inject(AuthenticationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should reset selected nodes from store', () => {
    component.onLogoutEvent();

    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([]));
  });

  it('should return the login route in case of basic auth', () => {
    spyOn(authService, 'isOauth').and.returnValue(false);

    const redirectLogout = component.getLogoutRedirectUri();
    expect(redirectLogout).toEqual('/login');
  });

  it('should return the value of redirectUriLogout as route in case of SSO auth', () => {
    spyOn(authService, 'isOauth').and.returnValue(true);
    appConfig.config['oauth2.redirectUriLogout'] = 'fake-logout';

    const redirectLogout = component.getLogoutRedirectUri();
    expect(redirectLogout).toEqual('fake-logout');
  });
});
