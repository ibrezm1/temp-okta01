/*!
 * Copyright (c) 2020-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { Component, Inject, OnInit } from '@angular/core';
import OktaSignIn from '@okta/okta-signin-widget';
import sampleConfig from '../app.config';
import { OktaAuth, SigninWithRedirectOptions } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';

const DEFAULT_ORIGINAL_URI = window.location.origin;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signIn: any;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
    this.signIn = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an OIDC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: sampleConfig.oidc.issuer?.split('/oauth2')[0],
      clientId: sampleConfig.oidc.clientId,
      redirectUri: sampleConfig.oidc.redirectUri,
      logo: '/assets/angular.svg',
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to Angular & Company',
        },
      },
      authParams: {
        issuer: sampleConfig.oidc.issuer
      },
    });
  }

  async ngOnInit() {
    this.signIn.showSignInToGetTokens({
      el: '#sign-in-widget',
      scopes: sampleConfig.oidc.scopes
    }).then((tokens: SigninWithRedirectOptions | undefined) => {
      const originalUri = this.oktaAuth.getOriginalUri();
      if (originalUri === DEFAULT_ORIGINAL_URI) {
        this.oktaAuth.setOriginalUri('/');
      }

      // Remove the widget
      this.signIn.remove();

      // In this flow the redirect to Okta occurs in a hidden iframe
      this.oktaAuth.signInWithRedirect(tokens);
    }).catch((err: any) => {
      // Typically due to misconfiguration
      throw err;
    });
  }

}
