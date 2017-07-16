'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = undefined;

//This function returns a descriptive sentence about your data.  Before a user starts a quiz, they can ask about a specific data element,
//like "Ohio."  The skill will speak the sentence from this function, pulling the data values from the appropriate record in your data.
function getSpeechDescription(item)
{
    var sentence = item.BirdName + " is the state bird of " + item.StateName + ".  I've added " + item.StateName + " to your Alexa app. Which other state bird would you like to know about?";
    return sentence;
}

//We have provided two ways to create your quiz questions.  The default way is to phrase all of your questions like: "What is X of Y?"
//If this approach doesn't work for your data, take a look at the commented code in this function.  You can write a different question
//structure for each property of your data.
function getQuestion(counter, property, item)
{
    return "Here is your " + counter + "th question.  What is the state bird" + " of "  + item.StateName + "?";
}

//This is the function that returns an answer to your user during the quiz.  Much like the "getQuestion" function above, you can use a
//switch() statement to create different responses for each property in your data.  For example, when this quiz has an answer that includes
//a state abbreviation, we add some SSML to make sure that Alexa spells that abbreviation out (instead of trying to pronounce it.)
function getAnswer(property, item)
{
    switch(property)
    {
        case "BirdName":
            return "The " + formatCasing(property) + " of " + item.StateName + " is " + item[property] + ". "
        break;
        default:
            return "The state bird of " + item.StateName + " is " + item[property] + ". "
        break;
    }
}

//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
"Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

//This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", "Le sigh",
"Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

//This is the welcome message for when a user starts the skill without a specific intent.
var WELCOME_MESSAGE = "Welcome to the State Bird Quiz Game!  You can ask me a question like 'What is the state bird of Oregon', or you can ask me to start a quiz.  What would you like to do?";

//This is the message a user will hear when they start a quiz.
var START_QUIZ_MESSAGE = "OK.  I will ask you the state bird for 10 different states.";

//This is the message a user will hear when they try to cancel or stop the skill, or when they finish a quiz.
var EXIT_SKILL_MESSAGE = "Thank you for playing the State Bird Quiz Game!  Let's play again soon!";

//This is the message a user will hear after they ask (and hear) about a specific data element.
var REPROMPT_SPEECH = "Which other state would you like to know about?";

//This is the message a user will hear when they ask Alexa for help in your skill.
var HELP_MESSAGE = "I know lots of things about state birds.  You can ask me about a state, and I'll tell you their state bird.  You can also test your knowledge by asking me to start a quiz.  What would you like to do?";


//This is the message a user will hear when they ask Alexa for help in your skill.
var ERROR_MESSAGE = "Sorry, I didn't get that. You can ask me about a state, and I'll tell you their state bird.  You can also test your knowledge by asking me to start a quiz.  What would you like to do?";


//This is the response a user will receive when they ask about something we weren't expecting.  For example, say "pizza" to your
//skill when it starts.  This is the response you will receive.
function getBadAnswer(item) { return "I'm sorry. " + item + " is not something I know very much about in this skill. " + HELP_MESSAGE; }

//This is the message a user will receive after each question of a quiz.  It reminds them of their current score.
function getCurrentScore(score, counter) { return "Your current score is " + score + " out of " + counter + ". "; }

//This is the message a user will receive after they complete a quiz.  It tells them their final score.
function getFinalScore(score, counter) { return "Your final score is " + score + " out of " + counter + ". "; }

//These next four values are for the Alexa cards that are created when a user asks about one of the data elements.
//This only happens outside of a quiz.

//If you don't want to use cards in your skill, set the USE_CARDS_FLAG to false.  If you set it to true, you will need an image for each
//item in your data.
var USE_CARDS_FLAG = true;

//This is what your card title will be.  For our example, we use the name of the state the user requested.
function getCardTitle(item) { return item.StateName;}

//This is the small version of the card image.  We use our data as the naming convention for our images so that we can dynamically
//generate the URL to the image.  The small image should be 720x400 in dimension.
function getSmallImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/720x400/" + abbrState(item.StateName) + "._TTH_.png"; }

//This is the large version of the card image.  It should be 1200x800 pixels in dimension.
function getLargeImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/1200x800/" + abbrState(item.StateName) + "._TTH_.png"; }

function abbrState(input) {

    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
var i=0;
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
    }
}

//=========================================================================================================================================
//TODO: Replace this data with your own.
//=========================================================================================================================================
var data = [
                {StateName: "Alabama",        BirdName: "Yellowhammer" },
                {StateName: "Alaska",         BirdName: "Willow Ptarmigan" },
                {StateName: "Arizona",        BirdName: "Cactus Wren" },
                {StateName: "Arkansas",       BirdName: "Mockingbird" },
                {StateName: "California",     BirdName: "California Valley Quail" },
                {StateName: "Colorado",       BirdName: "Lark Bunting" },
                {StateName: "Connecticut",    BirdName: "Robin" },
                {StateName: "Delaware",       BirdName: "Blue Hen Chicken" },
                {StateName: "Florida",        BirdName: "Mockingbird" },
                {StateName: "Georgia",        BirdName: "Brown Thrasher" },
                {StateName: "Hawaii",         BirdName: "Nene" },
                {StateName: "Idaho",          BirdName: "Mountain Bluebird" },
                {StateName: "Illinois",       BirdName: "Cardinal" },
                {StateName: "Indiana",        BirdName: "Cardinal" },
                {StateName: "Iowa",           BirdName: "Eastern Goldfinch" },
                {StateName: "Kansas",         BirdName: "Western Meadowlark" },
                {StateName: "Kentucky",       BirdName: "Cardinal" },
                {StateName: "Louisiana",      BirdName: "Eastern Brown Pelican" },
                {StateName: "Maine",          BirdName: "Chickadee" },
                {StateName: "Maryland",       BirdName: "Baltimore Oriole" },
                {StateName: "Massachusetts",  BirdName: "Chickadee" },
                {StateName: "Michigan",       BirdName: "Robin" },
                {StateName: "Minnesota",      BirdName: "Common Loon" },
                {StateName: "Mississippi",    BirdName: "Mockingbird" },
                {StateName: "Missouri",       BirdName: "Bluebird" },
                {StateName: "Montana",        BirdName: "Western Meadowlark" },
                {StateName: "Nebraska",       BirdName: "Western Meadowlark" },
                {StateName: "Nevada",         BirdName: "Mountain Bluebird" },
                {StateName: "New Hampshire",  BirdName: "Purple Finch" },
                {StateName: "New Jersey",     BirdName: "Eastern Goldfinch" },
                {StateName: "New Mexico",     BirdName: "Roadrunner" },
                {StateName: "New York",       BirdName: "Bluebird" },
                {StateName: "North Carolina", BirdName: "Cardinal" },
                {StateName: "North Dakota",   BirdName: "Western Meadowlark" },
                {StateName: "Ohio",           BirdName: "Cardinal" },
                {StateName: "Oklahoma",       BirdName: "Scissor-tailed Flycatcher" },
                {StateName: "Oregon",         BirdName: "Western Meadowlark" },
                {StateName: "Pennsylvania",   BirdName: "Ruffed Grouse" },
                {StateName: "Rhode Island",   BirdName: "Rhode Island Red" },
                {StateName: "South Carolina", BirdName: "Great Carolina Wren" },
                {StateName: "South Dakota",   BirdName: "Ring-necked Pheasant" },
                {StateName: "Tennessee",      BirdName: "Mockingbird" },
                {StateName: "Texas",          BirdName: "Mockingbird" },
                {StateName: "Utah",           BirdName: "Common American Gull" },
                {StateName: "Vermont",        BirdName: "Hermit Thrush" },
                {StateName: "Virginia",       BirdName: "Cardinal" },
                {StateName: "Washington",     BirdName: "Willow Goldfinch" },
                {StateName: "West Virginia",  BirdName: "Cardinal" },
                {StateName: "Wisconsin",      BirdName: "Robin" },
                {StateName: "Wyoming",        BirdName: "Western Meadowlark" }
            ];


//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

var counter = 0;

var states = {
    START: "_START",
    QUIZ: "_QUIZ"
};

const handlers = {
     "LaunchRequest": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
     },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AnswerIntent": function() {
        this.handler.state = states.START;
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    }
};

var startHandlers = Alexa.CreateStateHandler(states.START,{
    "Start": function() {
        this.emit(":ask", WELCOME_MESSAGE, HELP_MESSAGE);
    },
    "AnswerIntent": function() {
//         this.emit(":tell", "got here");
        var item = getItem(this.event.request.intent.slots);

       if (item !== undefined)
       {
         if (item[Object.getOwnPropertyNames(data[0])[0]] !== undefined)
         {
            if (USE_CARDS_FLAG)
            {
                var imageObj = {smallImageUrl: getSmallImage(item), largeImageUrl: getLargeImage(item)};
                this.emit(":askWithCard", getSpeechDescription(item), REPROMPT_SPEECH, getCardTitle(item), getTextDescription(item), imageObj);
            }
            else
            {
                this.emit(":ask", getSpeechDescription(item), REPROMPT_SPEECH);
            }
         }
         else
         {
            this.emit(":ask", getBadAnswer(item), getBadAnswer(item));
//              this.emit(":tell", EXIT_SKILL_MESSAGE);
         }
       }
       else
       {
         this.emit(":ask", ERROR_MESSAGE);
       }


    },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
});


var quizHandlers = Alexa.CreateStateHandler(states.QUIZ,{
    "Quiz": function() {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["quizscore"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function() {
        if (this.attributes["counter"] == 0)
        {
            this.attributes["response"] = START_QUIZ_MESSAGE + " ";
        }

        var random = getRandom(0, data.length-1);
        var item = data[random];

        var propertyArray = Object.getOwnPropertyNames(item);
        var property = propertyArray[getRandom(1, propertyArray.length-1)];

        this.attributes["quizitem"] = item;
        this.attributes["quizproperty"] = property;
        this.attributes["counter"]++;

        var question = getQuestion(this.attributes["counter"], property, item);
        var speech = this.attributes["response"] + question;

        this.emit(":ask", speech, question);
    },
    "AnswerIntent": function() {
        var response = "";
        var item = this.attributes["quizitem"];
        var property = this.attributes["quizproperty"]
//Investigate here
        var correct = compareSlots(this.event.request.intent.slots, item[property]);

        if (correct)
        {
            response = getSpeechCon(true);
            this.attributes["quizscore"]++;
        }
        else
        {
            response = getSpeechCon(false);
        }

        response += getAnswer(property, item);

        if (this.attributes["counter"] < 10)
        {
            response += getCurrentScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        }
        else
        {
            response += getFinalScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.emit(":tell", response + " " + EXIT_SKILL_MESSAGE);
        }
    },
    "AMAZON.StartOverIntent": function() {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.emitWithState("AnswerIntent");
    }
});

function compareSlots(slots, value)
{
    for (var slot in slots)
    {
        if (slots[slot].value != undefined)
        {
            if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

function getRandomSymbolSpeech(symbol)
{
    return "<say-as interpret-as='spell-out'>" + symbol + "</say-as>";
}

function getItem(slots)
{
    var propertyArray = Object.getOwnPropertyNames(data[0]);
    var value;

    for (var slot in slots)
    {
        if (slots[slot].value !== undefined)
        {
            value = slots[slot].value;
            for (var property in propertyArray)
            {
                var item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
                if (item.length > 0)
                {
                    return item[0];
                }
            }
        }
    }
    return value;
}

function getSpeechCon(type)
{
    var speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function formatCasing(key)
{
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

function getTextDescription(item)
{
    var text = "";

    for (var key in item)
    {
        text += formatCasing(key) + ": " + item[key] + "\n";
    }
    return text;
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, quizHandlers);
    alexa.execute();
};
