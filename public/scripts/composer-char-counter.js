$(document).ready(() => {
  console.log('document ready bitches');
  const $tweetText = $('#tweet-text');
  const $counterTotal = $('output.counter');

  $tweetText.on('input', () => {
    const characterCount = $tweetText.val().length; //event.target.value
    const charactersLeft = 140 - characterCount;

    $counterTotal.text(charactersLeft);

    if (charactersLeft < 0) {
      $counterTotal.addClass('negative-counter');
    } else {
      $counterTotal.removeClass('negative-counter');
    }
  });
});
