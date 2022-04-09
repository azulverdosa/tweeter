/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escapeUserInput = function (str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = (tweetData) => {
  console.log('meep?', tweetData.content);
  return $(`
    <article class="tweet-container">
      <header class="tweet-header">
        <figure>
          <img class="tweet--avatar" src="${tweetData.user.avatars}">
          <figcaption>${tweetData.user.name}</figcaption>
        </figure>
        <span>${tweetData.user.handle}</span>
      </header>
      <section>${escapeUserInput(tweetData.content.text)}</section>
      <footer class="tweet-footer">
        ${timeago.format(tweetData.created_at)}
        <div>
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `);
};

const renderTweets = (tweets) => {
  const $tweetContainer = $('.tweets-container').html('');

  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $tweetContainer.prepend($tweet);
  }
};

const loadTweets = () => {
  $.ajax({
    url: '/tweets',
    method: 'get',
    datatype: 'json',
    success: (tweets) => {
      renderTweets(tweets);
    },
    error: (err) => {
      console.log(`error: ${err}`);
    },
  });
};

const resetTextarea = () => {
  const $counterTotal = $('output.counter');

  $('#tweet-text').val('');
  $counterTotal.text(140);
  $counterTotal.removeClass('negative-counter');
};

$(document).ready(() => {
  loadTweets();

  const $form = $('.new-tweet form');
  const $tweetText = $('#tweet-text');
  const $errorWindow = $('.new-tweet .error-window');
  const $errorMessage = $('.error-window .error-message');

  $errorWindow.hide();

  $form.on('submit', function (event) {
    event.preventDefault();
    const value = $tweetText.val().trim();

    if (value === '') {
      $errorWindow.slideDown();
      $errorMessage.text('You need to actually SAY something silly! Try that again.');
    } else if (value.length > 140) {
      $errorWindow.slideDown();
      $errorMessage.text('You have a lot to say, huh? Try something a little less verbose...');
    } else {
      $errorWindow.slideToggle();

      const serializedData = $(this).serialize();

      $.post('/tweets', serializedData, () => {
        resetTextarea();
        loadTweets();
      }).fail(function (error) {
        console.error('something went wrong posting your tweet --', error?.responseJSON?.error);
      });
    }
  });
});
