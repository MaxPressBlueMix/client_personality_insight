/**
 * This file contains all of the server-side javascript code for the Client
 * Personality Insight application.
 */

Meteor.methods({
	getTwitterProfile: function(twitterUser)
		{
		console.log("Fetching profile for "+twitterUser);
		var profile=HTTP.get("https://twitter.com/intent/user?screen_name="+twitterUser,
								{timeout:10000,followRedirects:true});
		return profile;
		}
	});