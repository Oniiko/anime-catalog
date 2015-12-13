$(document).ready(function(){
  	$(document).foundation();
  	$('.genres').contents().each(function(){
    	this.textContent = this.textContent.replace(/,/g,', ');
	});
  	$('.short-synopsis').contents().each(function(){
  		var len = this.textContent.length;
  		if (len>200)
    	  this.textContent = this.textContent.substring(0, 199) + "...";
	});

  	highlightCategory();

  $("#search-button").click(function(){     
    var search_word = $("#search-word").val();
    console.log("search word = " + search_word);
    window.location.replace("/search?word="+search_word);
  });

	$("form[name=signup_form]").submit(function(e){     
		e.stopImmediatePropagation();
        var form = $(this);
        var form_json = serializeToJson(form);
        if (form_json.password != form_json.password2) {
        	e.preventDefault();
        	$("#msg").html('<div class="callout alert">Error: Two passwords do not match</div>')
        	return;
        }
 	});

	$("form[name=anime_library_entry_form]").submit(function(e){     
		e.stopImmediatePropagation();
    var form = $(this);
    var form_json = serializeToJson(form);

    $('#msg').removeClass('callout alert');
    $('#msg').html("");
    var error = validateAnimeEntryForm();
    console.log(error);
    if(error != null) {
      e.preventDefault();
      $('#msg').addClass('callout alert');
      $('#msg').html(error);
      return;
    }

    var send_url;
 		if(form_json.action == "create") {
 			//send_url = '/anime_library_entry/create'
 			return;
 		}
 		else {
	    e.preventDefault();
 			send_url = '/anime_library_entry/update';
 		}
 		        
 		$.ajax({
            type: 'POST',
                url: send_url,
                data: form.serialize(),
                success: function(response) {
                	// server side validation
                	if (response.errmsg != null) {
			 			$('#msg').addClass('callout alert');
 						$('#msg').html(response.errmsg);
                	} else if(response.review != null) {
                		var rating_selector = "#reviewrating-" + response.user_name;
        				$(rating_selector).html("Rating: " + response.rating);
                    	var text_selector = "#reviewtext-" + response.user_name;
        				$(text_selector).html(response.review.text);
        			}
                }
        });
	});

	$("form[name=manga_library_entry_form]").submit(function(e){     
		e.stopImmediatePropagation();
    var form = $(this);
    var form_json = serializeToJson(form);

    $('#msg').removeClass('callout alert');
    $('#msg').html("");
    var error = validateMangaEntryForm();
    console.log(error);
    if(error != null) {
      e.preventDefault();
      $('#msg').addClass('callout alert');
      $('#msg').html(error);
      return;
    }

    var send_url;
    //console.log("user_rating = " + $form["user_rating"].value);

 		if(form_json.action == "create") {
 			//send_url = '/manga_library_entry/create';
 			return;
 		}
 		else {
           e.preventDefault();
 			send_url = '/manga_library_entry/update';
 		}

    $.ajax({
        type: 'POST',
            url: send_url,
            data: form.serialize(),
            success: function(response) {
            	// server side validation
            	if (response.errmsg != null) {
	 			$('#msg').addClass('callout alert');
					$('#msg').html(response.errmsg);
            	}
            	else if(response.review != null) {
            		var rating_selector = "#reviewrating-" + response.user_name;
    				$(rating_selector).html("Rating: " + response.rating);
                	var text_selector = "#reviewtext-" + response.user_name;
    				$(text_selector).html(response.review.text);
    			}
            }
    });
	});
});

function highlightCategory() {
	var url_ref = window.location.href;
  	$("#anime-header").removeClass("highlight-header");
  	$("#manga-header").removeClass("highlight-header");
  	$("#anime-header").removeClass("lowlight-header");
  	$("#manga-header").removeClass("lowlight-header");
  	if (url_ref.indexOf("/anime") > -1) {
  		$("#anime-header").addClass("highlight-header");
  		$("#manga-header").addClass("lowlight-header");
  	} else if (url_ref.indexOf("/manga") > -1) {
  		$("#anime-header").addClass("lowlight-header");
  		$("#manga-header").addClass("highlight-header");
  	} 
}

function serializeToJson(form){
	var data = form.serialize().split("&");
    console.log(data);
    var obj={};
    for(var key in data)
    {
        console.log(data[key]);
        obj[data[key].split("=")[0]] = data[key].split("=")[1];
    }
    console.log(obj);
   return obj;
 }

function IsNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
}

function isDate(input){
	var RE = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
	return input.match(RE);
}

function validateAnimeEntryForm() {
	var form = document.forms["anime_library_entry_form"];
    var anime_id = form["anime_id"].value;
    var user = form["user"].value;
    if (user == null || user == "") {
    	return "You have to be logged in to add to library";
    }

    var episodes = Number(form["episodes"].value);
    if (anime_id == null) {
        return "Error: anime_id is null";
    }
    var rating = form["rating"].value;
    if (rating != null && rating != "") {
    	if (!IsNumeric(rating)) {
    		return "Error: rating is not number";
    	}
    	if (rating<0.0 || rating > 5.0) {
    		return "Local Error: rating must between 0 and 5";
    	}
    }

    var episodes_seen = Number(form["episodes_seen"].value);
    if (episodes_seen != null && episodes_seen != "") {
     	if (!IsNumeric(episodes_seen)) {
     		return "Error: episodes_seen is not number";
     	}
     	if ((episodes_seen > episodes) || (0 > episodes_seen)) {
			return "Error: episodes_seen must between 0 and " + episodes;
		}
	}
    var has_both = 0;
	var date_started = form["date_started"].value;
	if (date_started != null && date_started !="") {
		if (!isDate(date_started)) {
			return "Error: date started is not in a yyyy-mm-dd date format";
		}
		has_both++;
	}
	var date_finished = form["date_finished"].value;
	if (date_finished != null && date_finished !="") {
		if (!isDate(date_finished)) {
			return "Error: date finished is not a yyyy-mm-dd date format";
		}
		has_both++;
	}
	if (has_both ==2) {
		if (date_started > date_finished) {
			return "Error: the date finished can't be before date started";
		}

	}
	var status = form["status"].value;
	var status_enum = ["Plan to watch", "Watching", "Completed", "On-hold", "Dropped"];
	if (!(status_enum.includes(status))) {
		return "Error: invalid status type";
	}
	return null;
}

function validateMangaEntryForm() {
	var form = document.forms["manga_library_entry_form"];
    var manga_id = form["manga_id"].value;
    var user = form["user"].value;
    if (user == null || user == "") {
    	return "You have to be logged in to add to library";
    }

    var chapter_count = Number(form["chapter_count"].value);
    if (manga_id == null) {
        return "Error: manga_id is null";
    }
    var rating = form["rating"].value;
    if (rating != null && rating != "") {
    	if (!IsNumeric(rating)) {
    		return "Error: rating is not number";
    	}
    	if (rating<0.0 || rating > 5.0) {
    		return "Local Error: rating must between 0 and 5";
    	}
    }

    var chapters_read = Number(form["chapters_read"].value);
    if (chapters_read != null && chapters_read != "") {
     	if (!IsNumeric(chapters_read)) {
     		return "Error: chapters_read is not number";
     	}
     	if ((chapters_read > chapter_count) || (0 > chapters_read)) {
			return "Error: chapters_read must between 0 and " + chapter_count;
		}
	}
    var has_both = 0;
	var date_started = form["date_started"].value;
	if (date_started != null && date_started !="") {
		if (!isDate(date_started)) {
			return "Error: date started is not in a yyyy-mm-dd date format";
		}
		has_both++;
	}
	var date_finished = form["date_finished"].value;
	if (date_finished != null && date_finished !="") {
		if (!isDate(date_finished)) {
			return "Error: date finished is not a yyyy-mm-dd date format";
		}
		has_both++;
	}
	if (has_both ==2) {
		if (date_started > date_finished) {
			return "Error: the date finished can't be before date started";
		}

	}
	var status = form["status"].value;
	var status_enum = ["Plan to watch", "Watching", "Completed", "On-hold", "Dropped"];
	if (!(status_enum.includes(status))) {
		return "Error: invalid status type";
	}
	return null;
}
