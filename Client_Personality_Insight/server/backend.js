/**
 * This file contains all of the server-side javascript code for the Client
 * Personality Insight application.
 */

Twit = new TwitMaker({
    consumer_key:         '8raZ2m32vwHrcScLCn4TgHG46'
  , consumer_secret:      'Hpm8wlt32XqF7206boakwzTeTz1XmMmUVkbUnaY8Hcy7zhmu2f'
  , access_token:         '3405456669-gujkIIlh21r8QFKm5V7GFeO0BJKvreFuTMkDG7o'
  , access_token_secret:  '2IejqNcyBwV1XndJ7FPiZ6S4mjUwKdv8UdPYA7UNVg1Gc'
});

var watsonAPI="https://gateway.watsonplatform.net/personality-insights/api/v2/profile";
var userid="9cc2076b-d26f-4a43-996f-2e1f2ff9559c";
var password="fh8XVTwSJZBZ";


function Analysis() //this object will be sent to Watson
	{
	this.contentItems=[]; //array of AnalysisItem objects
	} 

function AnalysisItem(text) //These objects will populate the Analysis object
	{
//	this.id="";			 //(string, optional): Unique identifier for this content item.
//	this.userid="";		 //(string, optional): Unique identifier for the author of this content.,
//	this.sourceid="";	 //(string, optional): Identifier for the source of this content, for example, blog123 or twitter.,
//	this.created="";	 //(int, optional): Timestamp that identifies when this content was created, in milliseconds since midnight 1/1/1970 UTC. Required only for results about temporal behavior data.,
//	this.updated="";	 //(int, optional): Timestamp that identifies when this content was last updated, in milliseconds since midnight 1/1/1970 UTC. Required only for results about temporal behavior data.,
//	this.contenttype="";//(string, optional): MIME type of the content, for example, "text/plain" (the default) or "text/html". The tags are stripped from HTML content before it is analyzed; other MIME types are processed as is.,
//	this.charset="";	 //(string, optional): DEPRECATED. The value of this field is ignored. Character encoding for JSON data is assumed to be in UTF-8 format per the JSON specification.,
	this.language="en";	 //(string, optional): Language identifier (two-letter ISO 639-1 identifier). Both English ("en") and Spanish ("es") input content are supported. The default is English. In all cases, regional variants are treated as their parent language; for example, "en-US" is interpreted as "en".,
	this.content=text;	 //(string): Content to be analyzed. Up to 20 MB of content is supported.,
//	this.parentid="";	 //(string, optional): Unique id of the parent content item. Used to identify hierarchical relationships between posts/replies, messages/replies, etc.,
//	this.reply=false;	 //(boolean, optional): Indicates whether this content item is a reply to another content item.,
//	this.forward=false; //(boolean, optional): Indicates whether this content item is a forwarded/copied version of another content item.
    }




Meteor.methods({
	getTwitterProfile: function(twitterUser)
		{
		console.log("Fetching profile for "+twitterUser);
		var twitGetSync=Meteor.wrapAsync(Twit.get,Twit);
		var data=twitGetSync("users/show",{"screen_name":twitterUser});
console.log(data);
		return data;
		},
		
	getTweets: function(twitterUser)
		{
		console.log("Fetching tweets for "+twitterUser);
		var twitGetSync=Meteor.wrapAsync(Twit.get,Twit);
		var twitOptions={"screen_name":twitterUser,
						"include_rts":true,
						"trim_user":true,
						"count":200}; //can only get 200 at a time
		
		var enough=false;
		var wordCount=0;
		var tweetCount=0;
		var allTweets=new Analysis();
		var results=new Object();
		while(!enough)
			{
			var data=twitGetSync("statuses/user_timeline",twitOptions);
			if (data.length<5) //ran out of tweets
				enough=true;
			for (var i=0;i<data.length;i++)
				{
				var ai=new AnalysisItem(data[i].text);
				allTweets.contentItems.push(ai);
				tweetCount++;
				wordCount+=data[i].text.split(" ").length;
				}
			if (wordCount>6000)
				enough=true;
			else
				twitOptions.since_id=data[data.length-1].id; //start the next pass with the one after the last one here
			}
		
		console.log(wordCount+" words returned for "+twitterUser+" in "+tweetCount+" tweets");
		var wResults=analyze(allTweets);
		results[twitterUser]=wResults;
		return results;
		}
		
	});

function analyze(inputs)
	{
	console.log("Calling Watson...");
	var results=HTTP.post(watsonAPI,{"data":inputs,"auth":userid+":"+password});
//	console.log("********results start***************");
//	console.log(results.content);
//	console.log("********results end***************");
	var values=JSON.parse(results.content); //don't know why it's returned as a string
	values=values.tree.children[0].children; //this should give us the "Big 5"
	var summary=new Object(); 	// { openness: 
								//   { score: 0.9464374019628699,
								//     facets: 
								//      { adventurousness: 0.9280363521139997,
								//        'artistic interests': 0.17963832132581609,
								//        emotionality: 0.06337117497914888,
								//        imagination: 0.9570172523791224,
								//        intellect: 0.9706833753484337,
								//        liberalism: 0.8921932232345392 } },
								//   conscientiousness: 
								//    { ...etc
	
	for (var kidCount in values)
		{
		if (values[kidCount].id.indexOf("_parent")>0) //we have one of the parents
			{
			for (var gkidCount in values[kidCount].children)
				{
				var kids=values[kidCount].children[gkidCount];
//				console.log("***************** Working with ",kids.id);
				summary[kids.id.toLowerCase()]={"score":kids.percentage};
				var facets=new Object();
				summary[kids.id.toLowerCase()].facets=facets;
				for (var i in kids.children)
					{
					var gkid=kids.children[i];
					facets[gkid.id.toLowerCase()]=gkid.percentage;
					}
				}
			}
		}
	
	console.log(summary);
	return summary;
	}






