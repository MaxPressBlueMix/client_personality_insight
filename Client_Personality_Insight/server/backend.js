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

Meteor.methods({
	getTwitterProfile: function(twitterUser)
		{
		console.log("Fetching profile for "+twitterUser);
		var twitGetSync=Meteor.wrapAsync(Twit.get,Twit);
		var data=twitGetSync("users/show",{"screen_name":twitterUser});

		console.log("data:");
		console.log(data);

		return data;
		}
	});