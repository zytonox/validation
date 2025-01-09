const app = () => {
  const isUserLoggedIn = !!localStorage.getItem('isUserLoggedIn');
  if (isUserLoggedIn) {
    document.location.href = './main.html';
  }

  const isUserSignedUp = !!localStorage.getItem('loginData');

  const forms = document.querySelectorAll('.auth');
  const toggles = document.querySelectorAll('.auth__toggle');
  const labelNames = document.querySelectorAll('.auth__form-name');
  const labels = document.querySelectorAll('.auth__form-label');
  const inputs = document.querySelectorAll('.auth__form-info');
  const signUpButton = document.querySelectorAll('.auth__form-submit')[0];
  const loginButton = document.querySelectorAll('.auth__form-submit')[1];
  const errorMessages = document.querySelectorAll('.auth__form-error');

  const removeError = () => {
    labelNames.forEach(name => name.classList.remove('auth__form-error-color'));
    labels.forEach(label => label.classList.remove('auth__form-error-color'));
    inputs.forEach(label => label.classList.remove('auth__form-error-border'));
    errorMessages.forEach(error => (error.innerText = ''));
  };

  const renderError = (index, message) => {
    if (index !== 5) {
      labelNames[index].classList.add('auth__form-error-color');
      inputs[index].classList.add('auth__form-error-border');
    }

    labels[index].classList.add('auth__form-error-color');
    errorMessages[index].innerText = message;
  };

  const checkEmptyField = index => {
    const isEmpty =
      index !== 2 && index !== 5
        ? inputs[index].value.trim() === ''
        : !inputs[index].checked;

    if (isEmpty) {
      renderError(index, 'Поле обязательно для заполнения');

      return false;
    } else {
      return true;
    }
  };

  const checkEmail = index => {
    if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        inputs[index].value.trim()
      )
    ) {
      renderError(index, 'Email невалидный');

      return false;
    } else {
      return true;
    }
  };

  const checkPassword = index => {
    if (inputs[index].value.trim().length < 8) {
      renderError(index, 'Пароль должен содержать как минимум 8 символов');

      return false;
    } else {
      return true;
    }
  };

  const checkInput = (event, indexEmail, indexPassword, indexCheckbox) => {
    event.preventDefault();

    removeError();

    let email, password, checkbox;

    const isLoginForm = indexEmail !== 0;
    if (!isLoginForm) {
      email = checkEmptyField(indexEmail) ? checkEmail(indexEmail) : false;
      password = checkEmptyField(indexPassword)
        ? checkPassword(indexPassword)
        : false;
    } else {
      email = checkEmptyField(indexEmail);
      password = checkEmptyField(indexPassword);
    }
    checkbox = checkEmptyField(indexCheckbox);

    if (email && password && checkbox) {
      return true;
    }
  };

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      inputs[0].value = '';
      inputs[1].value = '';
      inputs[2].checked = false;
      inputs[3].value = '';
      inputs[4].value = '';
      inputs[5].checked = false;

      forms.forEach(form => form.classList.toggle('auth_inactive'));
    });
  });

  signUpButton.addEventListener('click', event => {
    const isValid = checkInput(event, 0, 1, 2);
    if (isValid) {
      localStorage.setItem(
        'loginData',
        JSON.stringify([inputs[0].value.trim(), inputs[1].value.trim()])
      );

      location.reload();
    }
  });

  loginButton.addEventListener('click', event => {
    const isValid = checkInput(event, 3, 4, 5);
    if (isValid) {
      const loginDataJSON = localStorage.getItem('loginData');
      const loginData = JSON.parse(loginDataJSON);
      const login = isUserSignedUp ? loginData[0] : null;
      const password = isUserSignedUp ? loginData[1] : null;

      const isLoginValid = inputs[3].value.trim() === login;
      const isPasswordValid = inputs[4].value.trim() === password;

      if (isLoginValid && isPasswordValid) {
        localStorage.setItem('isUserLoggedIn', 'true');

        document.location.href = './main.html';
      } else {
        inputs[3].value = '';
        inputs[4].value = '';

        renderError(3, '');
        renderError(4, 'Логин или Пароль невереный');
      }
    }
  });
};

app();
