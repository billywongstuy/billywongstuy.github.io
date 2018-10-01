var input_letters = document.getElementById("letters");
var required_letters = document.getElementById("require");
var include_phrase = document.getElementById("phrase");
var start_letter = document.getElementById("startL");
var end_letter = document.getElementById("endL");
var two_filter = document.getElementById("twoL");
var three_filter = document.getElementById("threeL");

var findWords = function(query,require,phrase,start,end) {
    if (require != null) {
	require = require.toLowerCase();
    }
    //console.log(require,phrase,start,end);
    return findWordsHelper("",query.toLowerCase(),words,{},require.toLowerCase(),phrase.toLowerCase(),start.toLowerCase(),end.toLowerCase());
};

var findWordsHelper = function(front,back,words,results,require,phrase,start,end) {
    //if (front.length > 1 && !(front in results) && front in words && requiredLetters(front,require)) {
    if (front.length > 1 && !(front in results) && front in words && wordChecks(front,require,phrase,start,end)) {
	results[front] = '';
    }
    if (back.length == 0) {
	return results; //just to terminate recursion instance
    }
    for (var i = 0; i < back.length; i++) {
	var letter = back.charAt(i);
	var new_back = back.substring(0,i) + back.substring(i+1);
	findWordsHelper(front+letter,new_back,words,results,require,phrase,start,end);
    }
    return results;
};


var wordChecks = function(word,require,phrase,start,end) {
    return requiredLetters(word,require) && containsPhrase(word,phrase) && startWith(word,start) && endWith(word,end) && !filterWord(word);
};


var filterWord = function(word) {
    return (word.length == 2 && two_filter.checked) || (word.length == 3 && three_filter.checked);
}


var requiredLetters = function(word,require) {
    if (require == null) {
	return true;
    }
    var letter_list = [];
    for (var i = 0; i < word.length; i++) {
	letter_list.push(word.charAt(i));
    }
    for (var i = 0; i < require.length; i++) {
	if (!letter_list.includes(require.charAt(i))) {
	    return false;
	}
	letter_list.splice(letter_list.indexOf(require.charAt(i)),1);
    }
    return true;
};


var containsPhrase = function(word,phrase) {
    if (phrase == null) {
	return true;
    }
    return word.includes(phrase);
};


var startWith = function(word,letter) {
    if (letter == null || letter == "") {
	return true;
    }
    return word.charAt(0) == letter;
}


var endWith = function(word,letter) {
    if (letter == null || letter == "") {
	return true;
    }
    return word.charAt(word.length-1) == letter;
}


var createPanel = function(name) {
    var panel = document.createElement("div");
    panel.className = "panel-heading";
    var words = document.createElement("a");
    words.className = "collapse-header";
    words.setAttribute("data-toggle","collapse");
    words.setAttribute("href","#"+name.replace(" ","_"));
    words.setAttribute("aria-expanded","false");
    words.setAttribute("aria-controls",name.replace(" ","_"));
    var title = document.createElement("h3");
    title.className = "panel-title";
    title.innerHTML = name;
    words.appendChild(title);
    panel.appendChild(words);
    document.getElementById("output").appendChild(panel);

    var collapse = document.createElement("div");
    collapse.className = "panel-collapse collapse";
    collapse.id = name.replace(" ","_");
    var list = document.createElement("ul");
    list.className = "list-group";
    collapse.appendChild(list);
    document.getElementById("output").appendChild(collapse);    

    return list;
    
}


document.getElementById("findWords").addEventListener("click",function() {
    var results = findWords(input_letters.value,require.value,include_phrase.value,start_letter.value,end_letter.value);
    var word_list = [];
    for (var key in results) {
	word_list.push(key);
    }
    word_list.sort(function(a,b) {
	return b.length-a.length || a.localeCompare(b);
    });
    /*
    for (var i = 0; i < word_list.length; i++) {
	out.innerHTML += ("<p>" + word_list[i].toUpperCase() + "</p>");
    }*/

    var out = document.getElementById("output");
    while (out.firstChild) {
	out.removeChild(out.firstChild);
    }

    if (word_list.length > 0) {
	out.style.display = "block";
    }
    else {
	out.style.display = "none";
    }
    
    var curr_len = input_letters.value.length+1;
    var curr_panel = null;
    for (var i = 0; i < word_list.length; i++) {
	if (word_list[i].length < curr_len) {
	    curr_panel = createPanel(word_list[i].length.toString() + " LETTER");
	    curr_len = word_list[i].length;
	}
	var item = document.createElement("li");
	item.innerHTML = word_list[i].toUpperCase();
	curr_panel.appendChild(item);
    }
    
});
