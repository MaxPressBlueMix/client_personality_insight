if (Meteor.isClient) {
	Session.setDefault('pageNumber',1);
	
	function SlideIn(el){
	    var elem = document.getElementById(el);
	    elem.style.transition = "left 1.5s linear 0s";
	    elem.style.left = "10px";
	}
	function SlideOut(el){
	    var elem = document.getElementById(el);
	    elem.style.transition = "left 1.5s linear 0s";
	    elem.style.left = "-200px";
	}

	
	function increasePageNumber()
		{
		var page=Session.get('pageNumber');
		Session.set('pageNumber',++page);
		}
	
	function decreasePageNumber()
		{
		var page=Session.get('pageNumber');
		Session.set('pageNumber',--page);
		}

	Template.page.helpers({
		  templateGestures: {
		    'swiperight div': function (event, templateInstance) {
		    	console.log(event);
		    	decreasePageNumber();
		    	},
		    'swipeleft div': function (event, templateInstance) {
		    	console.log(event);
		    	increasePageNumber();
		    	
		    	
//		    	alert("type: "+event.type+
//		    			"\ndeltaX: "+event.deltaX+
//		    			"\ndeltaY: "+event.deltaY+
//		    			"\ndeltaTime: "+event.deltaTime+
//		    			"\ndistance: "+event.distance+
//		    			"\nangle: "+event.angle+
//		    			"\nvelocityX: "+event.velocityX+
//		    			"\nvelocityY: "+event.velocityY+
//		    			"\nvelocity: "+event.velocity+
//		    			"\ndirection: "+event.direction+
//		    			"\noffsetDirection: "+event.offsetDirection+
//		    			"\nscale: "+event.scale+
//		    			"\nrotation: "+event.rotation+
//		    			"\ncenter: "+event.center+
//		    			"\nsrcEvent: "+event.srcEvent+
//		    			"\ntarget: "+event.target+
//		    			"\npointerType: "+event.pointerType+
//		    			"\neventType: "+event.eventType+
//		    			"\nisFirst: "+event.isFirst+
//		    			"\nisFinal: "+event.isFinal+
//		    			"\npointers: "+event.pointers+
//		    			"\nchangedPointers: "+event.changedPointers+
//		    			"\npreventDefault: "+event.preventDefault
//);
		      /* `event` is the Hammer.js event object */
		      /* `templateInstance` is the `Blaze.TemplateInstance` */
		      /* `this` is the data context of the element in your template, so in this case `someField` from `someArray` in the template */
		    }
		  },
		
	pageIs: function(pageNum) 
		{
		return Session.get('pageNumber')==pageNum;
		}
	});

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.company.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.company.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.nav.events({
	'click a': function(event, template) {
		
		if (event.target.name=="prev")
			decreasePageNumber();//slide in previous page
		else if (event.target.name=="next")
//			slidein("page2");
			increasePageNumber();//slide in next page
//		alert(Session.get("pageNumber"));
		
//		console.log(event.target.name+" clicked");
//		console.log(event);
//		console.log(template);
//		console.log(this);
	}  
  });
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
