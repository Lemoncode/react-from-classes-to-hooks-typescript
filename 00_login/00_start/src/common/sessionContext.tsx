import * as React from "react";

export interface SessionContextProps {
  login: string;
  updateLogin: (value) => void;
}

export const createDefaultUser = (): SessionContextProps => ({
  login: "no user",
  updateLogin: value => {}
});

export const SessionContext = React.createContext<SessionContextProps>(
  createDefaultUser()
);

interface State extends SessionContextProps {}

export class SessionProvider extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      login: createDefaultUser().login,
      updateLogin: this.setLoginInfo
    };
  }

  setLoginInfo = newLogin => {
    this.setState({ login: newLogin });
  };

  render() {
    return (
      <SessionContext.Provider value={this.state}>
        {this.props.children}
      </SessionContext.Provider>
    );
  }
}

export const withSessionContext = Component => props => (
  <SessionContext.Consumer>
    {({ login, updateLogin }) => (
      <Component {...props} login={login} updateLogin={updateLogin} />
    )}
  </SessionContext.Consumer>
);
