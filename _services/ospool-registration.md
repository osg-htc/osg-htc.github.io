---
    title: Registration and Login for the OSPool
    layout: table-of-contents
    table_of_contents:
        - name: Get An Account
          href: '#get-an-ospool-account'
        - name: Meet A Facilitator
          href: '#meet-with-a-research-computing-facilitator'
        - name: Login
          href: '#login'
        - name: Get Help
          href: '#get-help'
---

# OSPool User Registration

The OSPool is a computational resource available to any researcher affiliated with a project
at a US-based academic, government, or non-profit institution.  This page covers registration
and startup with an [access point](/services/access-point.html) operated by OSG and attached
to the OSPool.

To get access to the OSPool, you will:
* apply for an account,
* meet with a staff member for a short consultation and orientation, and
* upload your SSH key for simplified logins.

## Get an OSPool Account
To register for an OSPool account, submit an application using the following steps:

1. Go to the account [registration page](https://registry.cilogon.org/registry/co_petitions/start/coef:211). You will be redirected to the CILogon sign in page. Select your institution and use your institutional credentials to login.
   
   {: .border .border-5 }
   <img src="{{ '/assets/images/cilogon.png' | relative_url }}" class="img-fluid"/>
   
   If you have issues signing in using your institutional credentials, contact us at [support@osg-htc.org](mailto:support@osg-htc.org).


1. Once you sign in, you will be redirected to the "OSPool User Enrollment for New Users" page. Click "Begin" and enter your name, and email address in the following page. In many cases, this information will be automatically populated. If desired, it is possible to manually edit any information automatically filled in. Once you have entered your information, click "SUBMIT".

   {: .border .border-5 }
   <img src="{{ '/assets/images/comanage-enrollment-form.png' | relative_url }}" class="img-fluid"/>


1. After submitting your application, you will receive an email from [registry@cilogon.org](mailto:registry@cilogon.org) to verify your email address. Click the link listed in the email to be redirected to a page confirm your invitation details. Click the "ACCEPT" button to complete this step.

   {: .border .border-5 }
   <img src="{{ '/assets/images/comanage-email-verification-form.png' | relative_url }}" class="img-fluid"/>

## Meet with a Research Computing Facilitator

Once OSG staff receive your email verification, a Research Computing Facilitator will contact you within one business day to arrange a short consultation and introduction to OSPool resources. During this meeting, our staff will provide personalized start-up guidance per your specific computational research goals and activate your account.

Following the meeting, the Facilitator will approve your account, add your profile to any relevant projects, and ensure that you have access to an OSPool access point. (You will receive automated emails for some of these actions, which you can otherwise ignore.)


## Login

Once your account has been added to an access point, you will be able to log in using a terminal or SSH program. Logging in requires authenticating your credientials using one of two options: __web authentication__ or __SSH key pair authentication__. Additional information on this process will be provided during or following your meeting with a Research Computing Facilitator.


### Option 1: Login via Web Authentication

Logging in via web authentication requires no preparatory steps beyond having access to an internet browser. 

To authenticate using this approach: 

1. Open a terminal and type `ssh username@ap7.ospool.osg-htc.org`, being sure to replace `username` with your OSPool access point username. Upon hitting enter, the following text should appear with a unique, but similar, URL: 

   ```
   Authenticate at
   -----------------
   https://cilogon.org/device/?user_code=FF4-ZX6-9LK
   -----------------
   Type 'Enter' when you authenticate.
   ```

2. Copy the `https://` link, paste it into a web browser, and hit enter.  

3. You will be redirected to a new page where you will be prompted to login using your institutional credentials. Once you have done so, a new page will appear with the following text: "You have successfully approved the user code. Please return to your device for further instructions."  *NOTE* you will need to authenticate with the same identity you used to create your account; if you signed up via ORCID and login via your University account, then the login will fail.

4. Return to your terminal and hit 'Enter' to complete the login process. 


### Option 2: Login via SSH Key Pair Authentication

It is also possible to authenticate using an SSH key pair, if you prefer. Logging in using SSH keys does not require access to an internet browser to login into the access point, `ap7.ospool.osg-htc.org`. 

The process below describes how to upload a public key to the registration website. It assumes that a private/public key pair has already been generated. If you need to generate a key pair, see the "Step 1: Generate SSH Keys" section of this [OSG guide](https://support.opensciencegrid.org/support/solutions/articles/12000027675-generate-ssh-keys-and-activate-your-osg-login). 

1. Return to the [Registration Page](https://registry.cilogon.org/registry/co_petitions/start/coef:263) and login using CILogon if prompted.

1. Click your name at the top right. In the dropdown box, click "My Profile (OSG)" button.

   {: .border .border-5 }
   <img src="{{ '/assets/images/ssh-homepage-dropdown.png' | relative_url }}" class="img-fluid"/>

1. On the right hand side of your profile, click "Authenticators" link.

   {: .border .border-5 }
   <img src="{{ '/assets/images/ssh-edit-profile.png' | relative_url }}" class="img-fluid"/>

1. On the authenticators page, click the "Manage" button.

   {: .border .border-5 }
   <img src="{{ '/assets/images/ssh-authenticator-select.png' | relative_url }}" class="img-fluid"/>

1. On the new SSH Keys page, click "Add SSH Key" and browse your computer to upload your public SSH key.
   
   {: .border .border-5 }
   <img src="{{ '/assets/images/ssh-key-list.png' | relative_url }}" class="img-fluid"/>


## Get Help

For questions regarding logging in or creating an account, contact us at [support@osg-htc.org](mailto:support@osg-htc.org).
