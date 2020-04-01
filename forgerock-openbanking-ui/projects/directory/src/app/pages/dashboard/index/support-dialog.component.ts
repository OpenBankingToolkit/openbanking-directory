import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-support-dialog',
  template: `
    <h1 mat-dialog-title>Support</h1>
    <div mat-dialog-content>
      <p>
        Our documentation is available from our
        <a href="https://backstage.forgerock.com/knowledge/openbanking/" target="_blank">backstage portal</a>. It
        contains a tutorial on how to use our directory, along with instructions on how to get your first Open Banking
        API call set up and working.
      </p>
      <p>
        There is also an associated
        <a
          href="https://www.youtube.com/watch?v=Bq1CSW8a9wE&list=PLotly7WaYTXAiDj34bnJgE3Fr1MGEyMMj&start=0&autoplay=1"
          target="_blank"
          >youtube channel</a
        >
        that we recommend you take a look at, if you haven't already.
      </p>
      <p>
        If you are blocked, or you experience any unexpected behaviour from our ForgeRock Bank, you can reach out for
        help via our dedicated Slack channel. We use a Slack workspace provided by Open Banking Ltd called
        <a href="https://openbankingsupport.slack.com" target="_blank">'openbankingsupport'</a>, including a dedicated
        public channel for the ForgeRock platform called '#forgebank_support'. To access it you will first need to
        <a href="https://openbankingsupport.slack.com" target="_blank">register first </a>, after which you will be able
        to join the #forgebank_support public channel.
      </p>
      <p>
        This is also an occasion for us to invite you to the Open Banking UK community, which is a Slack community where
        everyone working on Open Banking is welcome. This workspace is called 'open-banking-uk', and joining is as
        simple as clicking this <a href="http://signup.openbanking.space/" target="_blank">following link</a>.
      </p>
    </div>
    <div mat-dialog-actions fxLayout="row">
      <div fxFlex></div>
      <button mat-button (click)="onOkClick()" cdkFocusInitial>Ok</button>
    </div>
  `
})
export class DirectorySupportDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DirectorySupportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: void
  ) {}

  onOkClick(): void {
    this.dialogRef.close();
  }
}
