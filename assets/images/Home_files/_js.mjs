import { importLib } from './modules/import.mjs';
import { search_Func1, routing_helper } from './modules/search.mjs';
import { setDropDown } from './modules/dropDown.mjs';
import { addToCart, fetchCart } from './modules/cart.mjs';
import { onLogout } from './modules/logout.mjs';
import { notification } from './modules/notification.mjs';
import { registerHelper } from './modules/handlebars.mjs';
import { observeDOM } from './modules/changeDetection.mjs';
import { removeSpinner } from './modules/spinner.mjs';
import { fetchContentInfo } from './modules/DynamicData.mjs'
import { loadAnalytics } from './modules/analytics.mjs';
import * as request from './modules/request-services.mjs';

importLib();

async function fetchDetails() {
  return await request.http_get({
    url: `/apis/gf-store/customers/v1/profile-detail`,
    isAccessTokenRequired: true,
  });
}

window.onload = async () => {
  removeSpinner();
  observeDOM(document.body, () => {
    $('a').on('click', function (e) {
      e.preventDefault();
      routing_helper(e);
    });
  });

  fetchContentInfo();
  fetchCart();
  registerHelper();
  loadAnalytics();

  const accessToken = localStorage.getItem('access_token');
  setDropDown(accessToken);

  if (accessToken) {
    const ResBody = await fetchDetails();
    if (ResBody.status === 'SUCCESS') {
      const info = ResBody.data;
      localStorage.setItem('user_name', info.first_name + " " + info.last_name);
      $('#user-name').html(info.first_name + " " + info.last_name);
    }
  }

  try {
    document.getElementById('search-btn').addEventListener('click', () => {
      search_Func1();
    });
    document.getElementById('search').addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        search_Func1();
      }
    });
  } catch (e) {
  }

  $('#expand').click(function () {
    $('#expand').addClass("d-none");
    $('#collapse').removeClass("d-none");
    $('#sub-nav').addClass("navbar-sub-nav-open");
    $("body").css("transition", "background 0.3s ease-in-out");
    $("body").css("background", "rgba(0, 0, 0, 0.500)");
    $("body").css("overflow-y", "hidden");
  });

  $('#collapse').click(function () {
    $('#expand').removeClass("d-none");
    $('#collapse').addClass("d-none");
    $('#sub-nav').removeClass("navbar-sub-nav-open");
    $("body").css("background", "rgba(0, 0, 0, 0)");
    $("body").css("overflow-y", "auto");
  });

  $('#cat-slides-left').click(function () {
    var x = $('#cat-slides-scroll-div').scrollLeft();
    $('#cat-slides-scroll-div').scrollLeft(x - 100);
  });

  $('#cat-slides-right').click(function () {
    var x = $('#cat-slides-scroll-div').scrollLeft();
    $('#cat-slides-scroll-div').scrollLeft(x + 100);
  });
};

//registering function as global function
window.addToCart = addToCart;
window.onLogout = onLogout;
window.notification = notification;
