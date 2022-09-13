for (const [key, value] of Object.entries(ratingLang)) {
    $('.star-' + key).raty({
      starOn: '/assets/image/rating/star-on.png',
      starOff: '/assets/image/rating/star-off.png',
      starHalf: '/assets/image/rating/star-half.png'
    });
  }
  
  var ratedType = document.querySelectorAll("input[name=rating_type]");
  var ratingComment = document.querySelector("textarea[name=rating_comment]");
  
  function resetRating() {
    for (const [key, value] of Object.entries(ratingLang)) {
      $('.star-' + key).data('raty').score(0);
      var setScore = document.querySelector(".star-" + key + " input[name=score]");
      setScore.value = "";
    }
  }
  
  function submitRating() {
    var jsonRated = {rating: {}, comment: ratingComment.value};
    try {
      for (const [key, value] of Object.entries(ratingLang)) {
        var getScore = document.querySelector(".star-" + key + " input[name=score]");
        if(getScore.value !== undefined && getScore.value !== null && getScore.value !== '') {
          if(getScore.value > 0 && getScore.value < 6) {
            jsonRated.rating[key] = getScore.value;
          } else {
            throw {code: 1, message: ratingErrorLang['invalid']};
          }
        } else {
          throw {code: 0, message: ratingLang[key] + ratingErrorLang['not_rated']};
        }
      }
    } catch (e) {
      if(e) {
        alert(e.message + "[" + e.code + "]");
        return false;
      }
    }
  
    var formData = new FormData();
    formData.append('data', JSON.stringify(jsonRated));
    yamon.fetch("/ajax/estimate/rate/" + ratingEstimateId.value, {
      method: "post",
      data: formData
    }).then(function(res){
      alert(res.message);
      if(res.status) {
        location.reload();
      }
    });
  }
  