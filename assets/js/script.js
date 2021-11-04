// ==================================================
// SCROLLING TICKER AT THE BOTTOM
// ==================================================
window.addEventListener('load', function () {
  var visitors = document.getElementById("visitors");
  var counter = 1
  var storedCounter = localStorage.getItem("count");
  count = parseInt(storedCounter)
  if (count) {
    localStorage.setItem("count", count + 1)
    visitors.innerHTML = "Total visitors: " + count
  } else {
    localStorage.setItem("count", counter)
    visitors.innerHTML = "Total visitors: " + counter
  }
})

function scrollingTicker() {
  var cd = new Date()
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  day = days[cd.getDay()];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var month = months[cd.getMonth()];
  var date = cd.getDate()
  var year = cd.getFullYear()

  var ampm = cd.getHours() >= 12 ? ' PM' : ' AM';
  hours = cd.getHours() % 12;
  hours = hours ? hours : 12;
  hours = hours.toString().length == 1 ? 0 + hours.toString() : hours;

  var minutes = cd.getMinutes().toString()
  minutes = minutes.length == 1 ? 0 + minutes : minutes;

  var seconds = cd.getSeconds().toString()
  seconds = seconds.length == 1 ? 0 + seconds : seconds;

  var currentDate = day + ", " + month + " " + date + ", " + year;
  currentTime = " - " + hours + ":" + minutes + ":" + seconds + " " + ampm;
  document.getElementById('scrollingTicker').innerHTML = currentDate + currentTime;
}
setInterval(scrollingTicker, 1000);


const Http = new XMLHttpRequest();
window.addEventListener("load", function () {
  console.log("getLocation Called");
  var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client"

  navigator.geolocation.getCurrentPosition(
    (position) => {
      bdcApi = bdcApi +
        "?latitude=" + position.coords.latitude +
        "&longitude=" + position.coords.longitude +
        "&localityLanguage=en";
      getApi(bdcApi);

    },
    (err) => {
      getApi(bdcApi);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
})

function getApi(bdcApi) {
  Http.open("GET", bdcApi);
  Http.send();
  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const results = JSON.parse(this.responseText);
      var city = results.city
      var country = results.countryName
      document.getElementById("mylocation").innerHTML = city + ", " + country
    }
  };
}

// ==================================================
// NAVBAR CHANGE ON SCROLL
// ==================================================
window.addEventListener('scroll', function () {
  var nav = document.querySelector('nav');
  var windowPosition = window.pageYOffset > 0;
  nav.classList.toggle('navscroll', windowPosition);
})


// ==================================================
// USER PORTAL
// ==================================================
function login() {
  username = document.getElementById("username").value;
  if (username.length >= 4) {
    localStorage.setItem("user", JSON.stringify(username));

    var storedUser = localStorage.getItem("user");
    var user = JSON.parse(storedUser);

    loginBtn = document.getElementById("loginBtn")
    userBtn = document.getElementById("displayUser")
    loginBtn.style.display = "none"
    userBtn.style.display = "block"
    userBtn.innerHTML = user

    $("#userLoginPortal").modal("hide")
    $("#welcomeModal").modal("show")
  }
}

window.addEventListener('load', function () {
  var storedUser = localStorage.getItem("user");
  var user = JSON.parse(storedUser);
  if (user) {
    loginBtn = document.getElementById("loginBtn")
    userBtn = document.getElementById("displayUser")
    loginBtn.style.display = "none"
    userBtn.style.display = "block"
    userBtn.innerHTML = user
  } else {
    $("#userLoginPortal").modal("show")
  }
})

function logout() {
  localStorage.removeItem("user");
  loginBtn = document.getElementById("loginBtn")
  userBtn = document.getElementById("displayUser")
  loginBtn.style.display = "block"
  userBtn.style.display = "none"
}

// ==================================================
// MENU FILTERTING
// ==================================================
var buttonFilters = {};
var buttonFilter;
var qsRegex;

var menu = $('.menu-card').isotope({
  itemSelector: '.menu-item',
  filter: function () {
    var $this = $(this);
    var searchResult = qsRegex ? $this.text().match(qsRegex) : true;
    var buttonResult = buttonFilter ? $this.is(buttonFilter) : true;
    return searchResult && buttonResult;
  },
});

$('.menu-filter').on('click', '.btn', function () {
  var $this = $(this);
  var $buttonGroup = $this.parents('.menu-filter');
  var filterGroup = $buttonGroup.attr('data-filter-group');
  buttonFilters[filterGroup] = $this.attr('data-filter');
  buttonFilter = concatValues(buttonFilters);
  menu.isotope();
});

var $quicksearch = $('.menu-search').keyup(debounce(function () {
  qsRegex = new RegExp($quicksearch.val(), 'gi');
  menu.isotope();
}));

$('.menu-filter').each(function (i, buttonGroup) {
  var $buttonGroup = $(buttonGroup);
  $buttonGroup.on('click', 'button', function () {
    $buttonGroup.find('.active').removeClass('active');
    $(this).addClass('active');
  });
});

function concatValues(obj) {
  var value = '';
  for (var prop in obj) {
    value += obj[prop];
  }
  return value;
}

function debounce(fn, threshold) {
  var timeout;
  threshold = threshold || 100;
  return function debounced() {
    clearTimeout(timeout);
    var args = arguments;
    var _this = this;

    function delayed() {
      fn.apply(_this, args);
    }
    timeout = setTimeout(delayed, threshold);
  };
}