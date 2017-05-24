(function() {
  var loginSubmit;
  $(function() {
    $('#imgCaptcha').click(function() {
      return this.src = $captchaBaseUrl + '?' + new Date().getTime();
    });
    $('#btnLogin').click(loginSubmit);
    return $('input').keyup(function(evt) {
      if (evt.keyCode === 13) {
        return loginSubmit();
      }
    });
  });

  loginSubmit = function() {
    var loginForm;
    loginForm = $('#loginForm');
    if (!loginForm.form('validate')) {
      return;
    }
    $.messager.progress({
      title: '提示',
      text: '数据处理中，请稍后....'
    });
    return $.post($loginPostUrl, loginForm.serialize(), function(data) {
      data = $.parseJSON(data);
      if (data.isSuccess) {
        window.location.href = $defaultUrl;
      } else {
        $.messager.alert('错误', data.message, 'error');
      }
      return $.messager.progress('close');
    });
  };

}).call(this);
