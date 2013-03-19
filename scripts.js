/**################################################
##
##   project:    partyAgenda - A Party Agenda made with jQuery Mobile
##   author:     @anotherwebstorm
##   demo:       code.anotherwebstorm.com/apps/partyagenda
##   Version:    1.0
##   Copyright:  (c) 2012-2013 Marco Cardoso
##
################################################**/

$(document).ready(function(){
  //##### Globals #####
  var parties,
    buildParties,
    showParties;

  //##### Let's get our LocalStorage Item parties object if exists #####
  if(localStorage.getItem('parties')){
    parties = JSON.parse(localStorage.getItem('parties'))
  }else{
    //Let's create an object with parties
    parties = [
      {
        id: 1,
        name: 'Party at Nacho House',
        type: 'Rock Party',
        drinks: true,
        food: false,
        gift: false,
        date: '20/05/2012',
        hour: '21:30',
        city: 'Madrid',
        place: 'TioVivo'
      },
      {
        id: 2,
        name: 'Incubus Summer Party',
        type: 'Rock Party',
        drinks: false,
        food: false,
        gift: false,        
        date: '12/05/2012',
        hour: '22:30',
        city: 'Lisbon',
        place: 'Kadock'
      },
      {
        id: 3,
        name: 'Maria Birthday',
        type: 'Birthday Party',
        drinks: false,
        food: false,
        gift: true,        
        date: '30/09/2012',
        hour: '15:30',
        city: 'Viseu',
        place: 'NB'
      }                     
    ];

    //and save it offline
    localStorage.setItem('parties', JSON.stringify(parties));
  }

  //##### Prepare and build parties for our homepage #####
  buildParties = function(){

    //First we empty our parties_list and then cycle through our object and retrieve it's data
    $('#parties_list').html('');

    for (var i = 0; i < parties.length; i++) {
      showParties(parties[i]);
    };

  }


  //DELETE PARTIES
  deleteParties = function(ev){
    var item = $(ev.currentTarget).data('delete'),
      index;

    for (var i = 0; i < parties.length; i++) {
      if(parties[i].id === item){
        index = i;
        break;
      }
    };

    //erase party
    parties.splice(index,1)

    //save localstorage with new object
    localStorage.setItem('parties', JSON.stringify(parties));

    //Add old for future removing existing pages
    $('.partypage').addClass('old');

    //Build Parties one more time
    buildParties();

    //go to homepage and refresh view
    $.mobile.changePage('#homepage');
    $('#parties_list').listview("refresh");

    //Remove from body old pages in 2 seconds
    setTimeout(function(){
      $('.partypage.old').remove();
    },2000)
  }

  //ADD PARTIES
  addParty = function(ev){
    var drinksChecked = ($('select#flip-drinks option:selected').val() === 'yes') ? true : false,
    foodChecked = ($('select#flip-food option:selected').val() === 'yes') ? true : false,
    giftChecked = ($('select#flip-gift option:selected').val() === 'yes') ? true : false,
    newParty= {
      id : parties.length + 1,
      name: $('input#party_name').val(),
      type: $('select#party_type option:selected').val(),
      drinks: drinksChecked,
      food: foodChecked,
      gift: giftChecked,
      date: $('input#party_date').val(),
      hour: $('input#party_hour').val(),
      city: $('input#party_city').val(),
      place: $('input#party_place').val()     
    }

    //Push new party to array
    parties.push(newParty);

    //Show Party
    showParties(newParty);

    //and save it offline
    localStorage.setItem('parties', JSON.stringify(parties));

    //go to homepage and refresh view
    $.mobile.changePage('#homepage');
    $('#parties_list').listview("refresh");

    //Clean up our form after adding
    $("#form_new_party").reset();

  }


  //##### Let's show parties list at our homepage and build dinamically our inside pages #####
  showParties = function(partydata){
    var listElementHtml,
      pageElementHtml,
      drinksChecked = (partydata.drinks) ? 'check' : 'delete',
      foodChecked = (partydata.food) ? 'check' : 'delete',
      giftChecked = (partydata.gift) ? 'check' : 'delete';

    //Create List Elements in homepage      
    listElementHtml = '<li><a class="party_item" href="#item'+partydata.id+'">'+partydata.name+'</a></li>';
    $('#parties_list').append(listElementHtml);

    //Create inside pages for each li
    pageElementHtml = '<div id="item'+partydata.id+'" data-role="page" class="partypage">' 
    pageElementHtml += '<div data-role="header">'
    pageElementHtml += '<h1>'+partydata.name+'</h1>' 
    pageElementHtml += '<a href="" data-rel="back">Back</a>' 
    pageElementHtml += '<a href="#" data-icon="delete" data-delete="'+partydata.id+'" class="ui-btn-right delete_button">Delete</a>' 
    pageElementHtml += '</div>' 
    pageElementHtml += '<div data-role="content">'
    pageElementHtml += '<h2>'+partydata.type+'</h2>'
    pageElementHtml += '<h3>When:</h3>'
    pageElementHtml += '<p>'+partydata.date+' - '+partydata.hour+'</p>'
    pageElementHtml += '<h3>Where:</h3>'
    pageElementHtml += '<p>'+partydata.city+' - '+partydata.place+'</p>'
    pageElementHtml += '<div data-role="collapsible" data-collapased="true" data-theme="b"><h3>Required Stuff:</h3>'
    pageElementHtml += '<div class="ui-grid-b">'
    pageElementHtml += '<div class="ui-block-a"><a href="#" data-role="button" data-icon="'+drinksChecked+'" data-iconpos="notext"></a><span>Drinks</span></div>'
    pageElementHtml += '<div class="ui-block-b"><a href="#" data-role="button" data-icon="'+foodChecked+'" data-iconpos="notext"></a><span>Food</span></div>'
    pageElementHtml += '<div class="ui-block-c"><a href="#" data-role="button" data-icon="'+giftChecked+'" data-iconpos="notext"></a><span>Gift</span></div>' 
    pageElementHtml += '</div>'   
    pageElementHtml += '</div>'    
    pageElementHtml += '</div>' 
    pageElementHtml += '</div>';

    //Append to body our new pages
    $('body').append(pageElementHtml);

    //##### Bind Delete Event #####
    $('.delete_button').bind('click tap', function(ev){
      ev.stopPropagation();
      deleteParties(ev);
    });

    //Refresh Parties List
    $('#parties_list').listview("refresh");
  }

  //##### Bind Add Page Event #####
  $('#save_party').on('click tap', function(ev){
    ev.stopPropagation();
    addParty(ev);
  });

  //##### Execute build Parties #####
  buildParties();

})