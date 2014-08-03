/*global $, document*/
/*jshint unused:false*/ 

'use strict';

function wpFeed(url, $el) {
   $.ajax({
     url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
     dataType: 'json',
     success: function(data) {
       
       var entries = data.responseData.feed.entries;
       var fragment = '';
       
       if(entries) {
          
          for(var i=0;i < 4; i++) {
            if (entries[i]) {
              fragment += '<li><a href="'+entries[i].link+'">'+entries[i].title+'</a></li>';
            }
          }
         
         $el.append(fragment);
         }
       }
   });
}

function storiesFeed(url, $el) {
   $.ajax({
     url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
     dataType: 'json',
     success: function(data) {
       
       var entries = data.responseData.feed.entries;
       var fragment = '';
       
       if(entries) {
          
          for(var i=0;i < 3; i++) {
            if (entries[i]) {
              fragment += '<li><a href="'+entries[i].link+'">'+entries[i].title+'</a></li>';
            }
          }
         
         $el.append(fragment);
         }
       }
   });
}