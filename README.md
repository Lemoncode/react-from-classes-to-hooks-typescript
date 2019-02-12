# react-from-classes-to-hooks-typescript

Simple applications examples: migrations from class based components to hooks.

## Examples

Under each example folder you will find two subfolders:

- 00_start: Starting point (using state + classes).
- 01_migrated: Application fully migrated to hooks.

## 00_login-page

In this application we present a login page (class based + state) and a second page that shows the logged in user (making use of context + hoc to keep the login name as a field available globally).

In the migration process:

- Migrate the login page from classes to stateless using hooks (created useLogin) and use the context using the (_useContext_) effect.

- Migrate the page B, remove the usage of an HOC to inject the login context and use the effect _useContext_

### LoginPage

Use custom hoo

**Original LoginPage class based component (extract)**

_./00_login/00_start/src/pages/login/loginPage.tsx_

```typescript
interface State {
  loginInfo: LoginEntity;
  showLoginFailedMsg: boolean;
  loginFormErrors: LoginFormErrors;
}

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  updateLogin: (value) => void;
}

class LoginPageInner extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      loginInfo: createEmptyLogin(),
      showLoginFailedMsg: false,
      loginFormErrors: createDefaultLoginFormErrors()
    };
  }

  onLogin = () => {
    loginFormValidation
      .validateForm(this.state.loginInfo)
      .then(formValidatinResult => {
        if (formValidatinResult.succeeded) {
          if (isValidLogin(this.state.loginInfo)) {
            this.props.updateLogin(this.state.loginInfo.login);
            this.props.history.push("/pageB");
          } else {
            this.setState({ showLoginFailedMsg: true });
          }
        } else {
          alert("error, review the fields");
        }
      });
  };

  onUpdateLoginField = (name: string, value) => {
    this.setState({
      loginInfo: {
        ...this.state.loginInfo,
        [name]: value
      }
    });

    loginFormValidation
      .validateField(this.state.loginInfo, name, value)
      .then(fieldValidationResult => {
        this.setState({
          loginFormErrors: {
            ...this.state.loginFormErrors,
            [name]: fieldValidationResult
          }
        });
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Card className={classes.card}>
          <CardHeader title="Login" />
          <CardContent>
            <LoginForm
              onLogin={this.onLogin}
              onUpdateField={this.onUpdateLoginField}
              loginInfo={this.state.loginInfo}
              loginFormErrors={this.state.loginFormErrors}
            />
          </CardContent>
        </Card>
        <NotificationComponent
          message="Invalid login or password, please type again"
          show={this.state.showLoginFailedMsg}
          onClose={() => this.setState({ showLoginFailedMsg: false })}
        />
      </>
    );
  }
}

export const LoginPage = withSessionContext(
  withStyles(styles)(withRouter<Props>(LoginPageInner))
);
```

**Migrated LoginPage class based component (extract)**

```typescript
function useLogin() {
  const [loginInfo, setLoginInfo] = React.useState(createEmptyLogin());
  const [showLoginFailedMessage, setShowLoginFailedMessage] = React.useState(
    false
  );
  const [loginFormErrors, setLoginFormErrors] = React.useState(
    createDefaultLoginFormErrors()
  );

  return {
    loginInfo,
    setLoginInfo,
    showLoginFailedMessage,
    setShowLoginFailedMessage,
    loginFormErrors,
    setLoginFormErrors
  };
}

interface Props extends RouteComponentProps, WithStyles<typeof styles> {}

const LoginPageInner = (props: Props) => {
  const {
    loginInfo,
    setLoginInfo,
    showLoginFailedMessage,
    setShowLoginFailedMessage,
    loginFormErrors,
    setLoginFormErrors
  } = useLogin();

  const loginContext = React.useContext(SessionContext);

  const onLogin = () => {
    loginFormValidation.validateForm(loginInfo).then(formValidationResult => {
      if (formValidationResult.succeeded) {
        if (isValidLogin(loginInfo)) {
          loginContext.updateLogin(loginInfo.login);
          props.history.push("/pageB");
        } else {
          setShowLoginFailedMessage(true);
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
        setLoginFormErrors({
          ...loginFormErrors,
          [name]: fieldValidationResult
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
            loginFormErrors={loginFormErrors}
          />
        </CardContent>
      </Card>
      <NotificationComponent
        message="Invalid login or password, please type again"
        show={showLoginFailedMessage}
        onClose={() => setShowLoginFailedMessage(false)}
      />
    </>
  );
};

export const LoginPage = withStyles(styles)(withRouter<Props>(LoginPageInner));
```

## 01_fetch

In this application we just fetch from Github api the list of members
belonging to a given group (lemoncode).

The original sample uses a class component that keeps in it's state
the list of the members (the fetch list is triggered in the _componentDidMount_ event from the class component).

Migration process:

- Refactor _MemberTable_ component to be a function component.
- Create a custom hook to hold the member list and expose the
  _loadmemberlist_ function.
- Call _useEffect_ with an empty array of parameters (This tells React that your effect doesn’t depend on any values from props or state, so it never needs to re-run).

**Original class based component**

_./01_fetch/00_start/component/memberTable.tsx_

```typescript
interface Props {}

// We define members as a state (the compoment holding this will be a container
// component)
interface State {
  members: MemberEntity[];
}

export class MemberTableComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // set initial state
    this.state = { members: [] };
  }

  public componentDidMount() {
    memberAPI.getAllMembers().then(members => this.setState({ members }));
  }

  public render() {
    return (
      <table className="table">
        <thead>
          <MemberHead />
        </thead>
        <tbody>
          {this.state.members.map((member: MemberEntity) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </tbody>
      </table>
    );
  }
}
```

**Migrated to hooks + function component**

_./01_fetch/01_migrated/component/memberTable.tsx_

```typescript
function useMembers() {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  const loadMembers = () => {
    memberAPI.getAllMembers().then(members => setMembers(members));
  };

  return { members, loadMembers };
}

export const MemberTableComponent = () => {
  const { members, loadMembers } = useMembers();

  React.useEffect(() => {
    loadMembers();
  }, []);

  return (
    <table className="table">
      <thead>
        <MemberHead />
      </thead>
      <tbody>
        {members.map((member: MemberEntity) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </tbody>
    </table>
  );
};
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
