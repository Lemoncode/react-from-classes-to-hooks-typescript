import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { LoginForm } from "./loginForm";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { LoginEntity, createEmptyLogin } from "../../model/login";
import { isValidLogin } from "../../api/login";
import { NotificationComponent } from "../../common";
import { LoginFormErrors, createDefaultLoginFormErrors } from "./viewmodel";
import { loginFormValidation } from "./loginValidations";
import { SessionContext } from "../../common";

// https://material-ui.com/guides/typescript/
const styles = theme =>
  createStyles({
    card: {
      maxWidth: 400,
      margin: "0 auto"
    }
  });

function useLogin() {
  const [loginInfo, setLoginInfo] = React.useState(createEmptyLogin());

  return {
    loginInfo,
    setLoginInfo
  };
}

interface State {
  showLoginFailedMessage: boolean;
  loginFormErrors: LoginFormErrors;
}

const formErrorInitialState: State = {
  showLoginFailedMessage: false,
  loginFormErrors: createDefaultLoginFormErrors()
};

const actionIds = {
  setShowLoginFailed: "SET_SHOW_LOGIN_FAILED",
  setLoginFormErrors: "SET_SHOW_LOGIN_FORM_ERRORS"
};

function formErrorReducer(state: State, action) {
  switch (action.type) {
    case actionIds.setShowLoginFailed:
      return { ...state, setShowLoginFailed: action.payload };
      break;

    case actionIds.setLoginFormErrors:
      return {
        ...state,
        loginFormErrors: {
          ...state.loginFormErrors,
          [action.payload.name]: action.payload.fieldValidationResult
        }
      };
      break;
  }

  return state;
}

interface Props extends RouteComponentProps, WithStyles<typeof styles> {}

const LoginPageInner = (props: Props) => {
  const { loginInfo, setLoginInfo } = useLogin();
  const [state, dispatch] = React.useReducer(
    formErrorReducer,
    formErrorInitialState
  );
  const loginContext = React.useContext(SessionContext);

  const onLogin = () => {
    loginFormValidation.validateForm(loginInfo).then(formValidationResult => {
      if (formValidationResult.succeeded) {
        if (isValidLogin(loginInfo)) {
          loginContext.updateLogin(loginInfo.login);
          props.history.push("/pageB");
        } else {
          dispatch({ type: actionIds.setShowLoginFailed, payload: true });
        }
      } else {
        alert("error, review the fields");
      }
    });
  };

  const onUpdateLoginField = (name: string, value) => {
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });

    loginFormValidation
      .validateField(loginInfo, name, value)
      .then(fieldValidationResult => {
        dispatch({
          type: actionIds.setLoginFormErrors,
          payload: {
            name,
            fieldValidationResult
          }
        });
      });
  };

  const { classes } = props;

  return (
    <>
      <Card className={classes.card}>
        <CardHeader title="Login" />
        <CardContent>
          <LoginForm
            onLogin={onLogin}
            onUpdateField={onUpdateLoginField}
            loginInfo={loginInfo}
            loginFormErrors={state.loginFormErrors}
          />
        </CardContent>
      </Card>
      <NotificationComponent
        message="Invalid login or password, please type again"
        show={state.showLoginFailedMessage}
        onClose={() =>
          dispatch({ type: actionIds.setShowLoginFailed, payload: false })
        }
      />
    </>
  );
};

export const LoginPage = withStyles(styles)(withRouter<Props>(LoginPageInner));
