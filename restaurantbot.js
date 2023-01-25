// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { MakeReservationDialog } = require('./componentDialogs/makeReservationDialog');


class RESTAURANTBOT extends ActivityHandler {
    constructor(conversationState, userState) {
        super();


        this.conversationState = conversationState;
        this.userState = userState;
        this.dialogState = conversationState.createProperty("dialogState");
        this.makeReservationDialog = new MakeReservationDialog(this.conversationState, this.userState);
        //this.conversationData = this.conversationState.createProperty('conservationData');


        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
           // const replyText = `Echo: ${context.activity.text}`;
            //await context.sendActivity(MessageFactory.text(replyText, replyText));
            await this.dispatchToIntentAsync(context);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

    /*   this.onDialog(async (context, next) => {

            // Save any state changes. The load happened during the execution of the Dialog.

            console.log("onDialog")

            await this.conversationState.saveChanges(context, false);

            await this.userState.saveChanges(context, false);

            await next();

        });  */

        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
        async sendWelcomeMessage(turnContext) {
            const{ activity} =turnContext;
    
            for(const idx in activity.membersAdded) {
                if(activity.membersAdded[idx].id !== activity.recipient.id) {
                    const welcomeMessage = `Welcome to Restaurant Reservation Bot`;
                    await turnContext.sendActivity(welcomeMessage);
                    await this.sendSuggestedActions(turnContext);
                }
            }
        }
        async sendSuggestedActions(turnContext) {
            var reply = MessageFactory.suggestedActions(['Make Reservation'],'what would you like to do today');
            await turnContext.sendActivity(reply);
            
        }  
        
        async dispatchToIntentAsync(context) {

       // const conversationData = await this.conversationData.get(context,{});



            switch (context.activity.text) {

                case 'Make Reservation' :
                   // console.log("Inside Make Reservation case");
                   // await this.conversationData.set(context,{endDialog: false});
                    await this.makeReservationDialog.run(context,this.dialogState);
                    //conversationData.endDialog = await this.makeReservationDialog.isDialogComplete();
                   /* if(conversationData.endDialog)

                    {
            
            
                        await this.sendSuggestedActions(context);
            
                    }*/
                    break;

                default : console.log("Did not match the case");
                            break;
            }

        }
    }

module.exports.RESTAURANTBOT = RESTAURANTBOT;
