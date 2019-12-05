import '../styles/index.scss';

import './masonry';
import './charts';
import './popover';
import './scrollbar';
import './search';
import './sidebar';
import './skycons';
import './vectorMaps';
import './chat';
import './datatable';
import './datepicker';
import './email';
import './fullcalendar';
import './googleMaps';
import './utils';
import Chart from 'chart.js';
import { COLORS } from './constants/colors';


$( document ).ready(function() {

	function send_request()
	{
		var keyword = $(".search-input input").val();

		var form_data =  {
		            'numberOfWords' : 10
		        };

		$.ajax({

		    url : 'http://dummy.restapiexample.com/api/v1/employees',
		    type : 'GET',
		    data : {
		        'numberOfWords' : 10
		    },
		    dataType:'json',
		    success : function(data) {fetchdata2(data);},
		    error   : function(request,error) {console.log("FAILED: "+error);}
		});
	}
   
   function fetchdata2(tweet_data)
   {
   	console.log("This thing works");
   	console.log(tweet_data);
   }

  // focus the textbox when the page is loaded
  $('.search-input input').focus();

  // fetch data function runs when enter key or the search button is pressed
  function fetchdata() 
  {
  	var moment = require("moment");

  	var keyword = $(".search-input input").val();
    console.log("Search keyword: "+keyword);

    var sample_data = require('./sample_data_new.json');
    var tweets = sample_data.docs.slice(0,10);
    var trending_hashtags = sample_data.trending_hashtags;
    var num_found = sample_data.numFound;
    var sent_time = sample_data.sentiment_over_time;

    for (var t in tweets)
    {
    	var tweet = tweets[t];

    	var tweet_element =    '<div class="email-list-item peers fxw-nw p-20 bdB bgcH-grey-100 cur-p">\
                                  <div class="peer peer-greed ov-h">\
                                    <div class="peers ai-c">\
                                      <div class="peer peer-greed">\
                                        <h5 class="fsz-def tt-c c-grey-900">$name</h5>\
                                      </div>\
                                      <div class="peer">\
                                        <large>$emoji</large>\
                                      </div>\
                                    </div>\
                                    <div class="peers ai-c">\
                                      <div class="peer peer-greed">\
                                        <h6>$handle</h6>\
                                      </div>\
                                      <div class="peer">\
                                        <small>$time</small>\
                                      </div>\
                                    </div>\
                                    <span class="whs-nw w-100 ov-h tov-e d-b">$text</span>\
                                  </div>\
                                </div>';


		var time_string = moment(tweet["tweet_date"][0]).format("lll");
		var sent = tweet["sentiment_score"];

		function get_emoji(sent) 
		{
			var emoji = "😐";

			if ( sent > -0.25 && sent < 0.25) 
			{
			  emoji = "😐";
			} 
			else if ( sent >= 0.25 && sent < 0.50) {
			  emoji = "😀";
			} 
			else if ( sent >= 0.50 && sent < 0.75) {
			  emoji = "😃";
			}
			else if ( sent >= 0.75) {
			  emoji = "😁";
			}


			else if ( sent <= 0.25 && sent > 0.50) {
			  emoji = "😑";
			} 
			else if ( sent <= 0.50 && sent > 0.75) {
			  emoji = " 😒";
			}
			else if ( sent <= 0.75) {
			  emoji = "😤";
			}

		  	return emoji;
		}
		
		var emoji = get_emoji(sent);

		tweet_element = tweet_element.replace('$handle', "@".concat(tweet["poi_name"][0])  );
		tweet_element = tweet_element.replace('$emoji',  "Emotional Tone: ".concat(emoji)  );
		tweet_element = tweet_element.replace('$name',   tweet["user.name"][0] );
		tweet_element = tweet_element.replace('$time',   time_string		   );
		tweet_element = tweet_element.replace('$text',   tweet["tweet_text"][0]);


	    $('#tweet_container').append(tweet_element);
	    $("#sentiment").html(get_emoji(sample_data.docs.average_sentiment)); 
	}

	var c   = ["deep-purple","green","blue","amber","red","red"];

	// adding trending hashtags
	var count = 0;
	while (count < 6)
	{
		var hashtag = "#".concat(trending_hashtags[count][0]);
		var number  = trending_hashtags[count][1];
		var color   = c[count];

		var template = '<li class="nav-item">\
                          <a href="" class="nav-link c-grey-800 cH-blue-500">\
                            <div class="peers ai-c jc-sb">\
                              <div class="peer peer-greed">\
                                <span>$hashtag</span>\
                              </div>\
                              <div class="peer">\
                                <span class="badge badge-pill bgc-$color1-50 c-$color2-700">$number</span>\
                              </div>\
                            </div>\
                          </a>\
                        </li>';



        template = template.replace('$hashtag', hashtag);
        template = template.replace('$number' , number);
        template = template.replace('$color1' , color);
        template = template.replace('$color2' , color);

        $('#trending').append(template);

		count = count + 1;

		if (count >= trending_hashtags.length)
		{
			break;
		}
	}
	
    $("#num_found").html(num_found); 



    var sent_xx = [];
    var sent_yy = [];

    for (var s in sent_time)
    {
    	sent_xx.push(moment(sent_time[s][0]).format("lll"));
    	sent_yy.push(sent_time[s][1]);
    }


    const lineChartBox = document.getElementById('sentiment-chart');

    if (lineChartBox) {
      const lineCtx = lineChartBox.getContext('2d');
      lineChartBox.height = 80;

      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: sent_xx,
          datasets: [{
            label                : 'Emotional Tone',
            backgroundColor      : 'rgba(232, 245, 233, 0.5)',
            borderColor          : COLORS['blue-500'],
            pointBackgroundColor : COLORS['blue-700'],
            borderWidth          : 2,
            data                 : sent_yy,
          }],
        },

        options: {
          legend: {
            display: false,
          },
        },

      });
    }



    var below_stuff =  '<div class="peer">\
                          <span class="fsz-def fw-600 mR-10 c-grey-800">10% <i class="fa fa-level-up c-green-500"></i></span>\
                          <small class="c-grey-500 fw-600">% change in Emotional Tone over time</small>\
                        </div>';
    $('#below_stuff').html(below_stuff);


	console.log("Search ended");
  }


  $('.search-toggle').on('click', e => 
  {
    send_request();
  });

  

  $(".search-input input").on('keyup', function (e) 
  {
    if (e.keyCode === 13) {
        send_request();
    }
  });

});
